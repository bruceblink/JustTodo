#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      out[key] = 'true';
      continue;
    }
    out[key] = value;
    i += 1;
  }
  return out;
}

function required(args, key) {
  const value = args[key];
  if (!value || value === 'true') {
    throw new Error(`Missing required argument: --${key}`);
  }
  return value;
}

function parseBooleanArg(value, fallback) {
  if (value === undefined || value === null || value === 'true') return fallback;
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }
  if (
    normalized === 'false' ||
    normalized === '0' ||
    normalized === 'no' ||
    normalized === 'off'
  ) {
    return false;
  }
  return fallback;
}

function toRustLibName(packageName) {
  return `${packageName.replace(/-/g, '_')}_lib`;
}

function toAutostartArg(packageName) {
  return `--${packageName.toLowerCase()}-autostart-hidden`;
}

function parseGitHubRepo(repoUrl) {
  try {
    const url = new URL(repoUrl);
    if (!url.hostname.includes('github.com')) return null;
    const parts = url.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/');
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1], slug: `${parts[0]}/${parts[1]}` };
  } catch {
    return null;
  }
}

function sponsorLabel(sponsorUrl) {
  if (!sponsorUrl) return '';
  try {
    const u = new URL(sponsorUrl);
    const p = u.pathname.replace(/^\//, '');
    return `${u.hostname}/${p}`.replace(/\/$/, '');
  } catch {
    return sponsorUrl;
  }
}

async function readJson(file) {
  const fp = path.join(ROOT, file);
  return JSON.parse(await readFile(fp, 'utf8'));
}

async function writeJson(file, value) {
  const fp = path.join(ROOT, file);
  await writeFile(fp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function replaceTextFile(file, replacers) {
  const fp = path.join(ROOT, file);
  let content = await readFile(fp, 'utf8');
  for (const [pattern, replacement] of replacers) {
    content = content.replace(pattern, replacement);
  }
  await writeFile(fp, content, 'utf8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = args['dry-run'] === 'true';

  const appName = required(args, 'app-name');
  const packageName = required(args, 'package-name');
  const bundleId = required(args, 'bundle-id');
  const authorName = required(args, 'author-name');
  const authorEmail = required(args, 'author-email');
  const authorUrl = required(args, 'author-url');
  const repositoryUrl = required(args, 'repository-url');
  const sponsoringUrl = args['sponsoring-url'] && args['sponsoring-url'] !== 'true' ? args['sponsoring-url'] : '';
  const updaterEndpoint =
    args['updater-endpoint'] && args['updater-endpoint'] !== 'true'
      ? args['updater-endpoint']
      : `${repositoryUrl.replace(/\/$/, '')}/releases/latest/download/latest.json`;
  const enableUpdater = parseBooleanArg(args['enable-updater'], true);
  const enableAutostart = parseBooleanArg(args['enable-autostart'], true);

  const rustLibName = toRustLibName(packageName);
  const autostartArg = toAutostartArg(packageName);
  const gh = parseGitHubRepo(repositoryUrl);

  if (!dryRun) {
    const packageJson = await readJson('package.json');
    packageJson.name = packageName;
    packageJson.author = `[${authorName} <${authorEmail}>](${authorUrl})`;
    packageJson.authorUrl = authorUrl;
    packageJson.sponsoringUrl = sponsoringUrl;
    packageJson.repository = { type: 'git', url: repositoryUrl };
    packageJson.scaffold = {
      ...(packageJson.scaffold ?? {}),
      features: {
        updater: enableUpdater,
        autostart: enableAutostart,
      },
    };
    await writeJson('package.json', packageJson);

    const tauriConf = await readJson('src-tauri/tauri.conf.json');
    tauriConf.productName = appName;
    tauriConf.identifier = bundleId;
    if (Array.isArray(tauriConf.app?.windows) && tauriConf.app.windows[0]) {
      tauriConf.app.windows[0].title = appName;
    }
    if (tauriConf.plugins?.updater?.endpoints && tauriConf.plugins.updater.endpoints[0]) {
      tauriConf.plugins.updater.endpoints[0] = updaterEndpoint;
    }
    await writeJson('src-tauri/tauri.conf.json', tauriConf);

    const capability = await readJson('src-tauri/capabilities/default.json');
    const currentPermissions = Array.isArray(capability.permissions) ? capability.permissions : [];
    const nextPermissions = currentPermissions.filter((perm) => {
      if (!enableUpdater && perm === 'updater:default') return false;
      if (!enableAutostart && perm === 'autostart:default') return false;
      return true;
    });
    if (enableUpdater && !nextPermissions.includes('updater:default')) {
      nextPermissions.push('updater:default');
    }
    if (enableAutostart && !nextPermissions.includes('autostart:default')) {
      nextPermissions.push('autostart:default');
    }
    capability.permissions = nextPermissions;
    await writeJson('src-tauri/capabilities/default.json', capability);

    const defaultSettings = await readJson('src-tauri/src/app/default/settings.json');
    defaultSettings.allowAutoStartUp = enableAutostart ? !!defaultSettings.allowAutoStartUp : false;
    await writeJson('src-tauri/src/app/default/settings.json', defaultSettings);

    const settingsSchema = await readJson('src/settings/settings.schema.json');
    settingsSchema.$id = `${bundleId}.settings.schema.v1`;
    settingsSchema.title = `${appName} Settings Schema`;
    await writeJson('src/settings/settings.schema.json', settingsSchema);

    await replaceTextFile('Cargo.toml', [
      [/^authors\s*=\s*\[.*\]/m, `authors = ["${authorName} <${authorEmail}>"]`],
      [/^repository\s*=\s*".*"/m, `repository = "${repositoryUrl}"`],
    ]);

    await replaceTextFile('src-tauri/Cargo.toml', [
      [/^name\s*=\s*".*"/m, `name = "${packageName}"`],
      [/^name\s*=\s*".*_lib"/m, `name = "${rustLibName}"`],
    ]);

    await replaceTextFile('src-tauri/src/main.rs', [
      [/^\s*[A-Za-z0-9_]+_lib::run\(\)/m, `    ${rustLibName}::run()`],
    ]);

    await replaceTextFile('src-tauri/src/lib.rs', [
      [/const AUTOSTART_HIDDEN_ARG: &str = ".*";/, `const AUTOSTART_HIDDEN_ARG: &str = "${autostartArg}";`],
    ]);

    await replaceTextFile('src/components/About.tsx', [
      [/<Text fw=\{700\}>.*<\/Text>/, `<Text fw={700}>${appName}</Text>`],
      [/link: \{ url: `https:\/\/github\.com\/[^`]+`, label: '@[^']+' \}/, `link: { url: \`https://github.com/${gh?.owner ?? authorName}\`, label: '@${gh?.owner ?? authorName}' }`],
      [/label: '@[^']+\/[^']+'/, `label: '@${gh?.slug ?? repositoryUrl.replace(/^https?:\/\//, '')}'`],
      [/label: '@[^']+\/[^']+\/issues'/, `label: '@${gh?.slug ?? repositoryUrl.replace(/^https?:\/\//, '')}/issues'`],
      [/label: '@[^']+\/[^']+\/discussions'/, `label: '@${gh?.slug ?? repositoryUrl.replace(/^https?:\/\//, '')}/discussions'`],
      [/label: 'BuyMeACoffee\/[^']*'/, `label: '${sponsorLabel(sponsoringUrl)}'`],
    ]);

    await replaceTextFile('src/components/UpdaterModal.tsx', [
      [/\{t\('.* v\{\{version\}\} is available!', \{ version: update\.version \}\)\}/, `{t('${appName} v{{version}} is available!', { version: update.version })}`],
      [/openUrl\('https:\/\/github\.com\/[^']+\/releases\/latest'\)/, `openUrl('${repositoryUrl.replace(/\/$/, '')}/releases/latest')`],
    ]);

    await replaceTextFile('src/components/settings-ui/Settings.tsx', [
      [/Automatically open .* every time u start the computer/, `Automatically open ${appName} every time u start the computer`],
    ]);

    await replaceTextFile('README.md', [[/^# .+ - Tauri 2\.0 脚手架/m, `# ${appName} - Tauri 2.0 脚手架`]]);
  }

  console.log('Template initialization summary:');
  console.log(`- app-name: ${appName}`);
  console.log(`- package-name: ${packageName}`);
  console.log(`- bundle-id: ${bundleId}`);
  console.log(`- repository-url: ${repositoryUrl}`);
  console.log(`- updater-endpoint: ${updaterEndpoint}`);
  console.log(`- enable-updater: ${enableUpdater}`);
  console.log(`- enable-autostart: ${enableAutostart}`);
  console.log(`- dry-run: ${dryRun}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
