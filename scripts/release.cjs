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

const versionArg = process.argv[2];
if (!versionArg) {
  console.error(
    'Error: Please specify version bump type (patch/minor/major) or exact version (for example 0.2.0)',
  );
  process.exit(1);
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

tauriPackageJson.version = newVersion;
fs.writeFileSync(tauriPackageJsonPath, JSON.stringify(tauriPackageJson, null, 2) + '\n');

try {
  execSync(`node "${syncVersionScript}"`, { stdio: 'inherit' });
  execSync(`node "${validateVersionScript}"`, { stdio: 'inherit' });
  execSync('git status --short', { stdio: 'inherit' });
} catch (error) {
  console.error('Release preparation failed');
  process.exit(1);
}
