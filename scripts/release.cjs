#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const tauriPackageJsonPath = path.join(__dirname, '../src-tauri/package.json');
const syncVersionScript = path.join(__dirname, 'sync-version.cjs');
const validateVersionScript = path.join(__dirname, 'validate-version.cjs');

const tauriPackageJson = JSON.parse(fs.readFileSync(tauriPackageJsonPath, 'utf8'));
const currentVersion = tauriPackageJson.version;

if (!currentVersion) {
  console.error('Error: No version found in src-tauri/package.json');
  process.exit(1);
}

const hotfixMode = process.argv.includes('--hotfix');
let versionArg = process.argv[2];
if (versionArg === 'version') {
  versionArg = process.argv[3];
}

if (!versionArg) {
  console.error(
    'Error: Please specify release target. Example: pnpm release patch OR pnpm release version 0.2.0',
  );
  process.exit(1);
}

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function readStdout(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function tagExists(tagName) {
  const local = readStdout(`git tag --list "${tagName}"`);
  if (local) return true;
  const remote = readStdout(`git ls-remote --tags origin ${tagName}`);
  return !!remote;
}

function ensureCleanTree() {
  const status = readStdout('git status --porcelain');
  if (status) {
    console.error('Error: Git worktree is not clean. Please commit or stash changes first.');
    process.exit(1);
  }
}

let newVersion;
if (versionArg === 'patch' || versionArg === 'minor' || versionArg === 'major') {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  switch (versionArg) {
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    default:
      newVersion = `${major + 1}.0.0`;
      break;
  }
} else {
  if (!/^\d+\.\d+\.\d+$/.test(versionArg)) {
    console.error(`Error: Invalid version format "${versionArg}". Expected format X.Y.Z`);
    process.exit(1);
  }
  newVersion = versionArg;
}

try {
  ensureCleanTree();

  tauriPackageJson.version = newVersion;
  fs.writeFileSync(tauriPackageJsonPath, JSON.stringify(tauriPackageJson, null, 2) + '\n');

  run(`node "${syncVersionScript}"`);
  run(`node "${validateVersionScript}"`);

  // Local quality gate before publishing.
  run('pnpm lint');
  run('pnpm -s tsc --noEmit');
  if (!hotfixMode) {
    run('pnpm test -- --run');
  }
  run('cargo check --manifest-path src-tauri/Cargo.toml');

  run('git add package.json src-tauri/package.json src-tauri/tauri.conf.json Cargo.toml Cargo.lock src-tauri/Cargo.lock');
  const hasStagedChanges = execSync('git diff --cached --quiet; echo $LASTEXITCODE', {
    encoding: 'utf8',
    shell: 'powershell',
  }).trim() !== '0';
  if (hasStagedChanges) {
    run(`git -c commit.gpgsign=false commit -m "chore(release): v${newVersion}"`);
  } else {
    console.log(`No version file changes detected for v${newVersion}, skip version commit.`);
  }

  const tagName = `v${newVersion}`;
  if (tagExists(tagName)) {
    console.error(`Error: tag ${tagName} already exists locally or on origin.`);
    process.exit(1);
  }
  run(`git tag ${tagName}`);

  run('git push origin HEAD');
  run(`git push origin ${tagName}`);

  console.log(`Release prepared and pushed: ${tagName}`);
  console.log('GitHub Actions publish workflow should now run automatically.');
} catch (error) {
  console.error('Release preparation failed');
  process.exit(1);
}
