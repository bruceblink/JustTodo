#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const tauriPackageJsonPath = path.join(__dirname, '../src-tauri/package.json');
const webAppPackageJsonPath = path.join(__dirname, '../package.json');
const tauriConfigPath = path.join(__dirname, '../src-tauri/tauri.conf.json');
const cargoTomlPath = path.join(__dirname, '../Cargo.toml');

const tauriPackageJson = JSON.parse(fs.readFileSync(tauriPackageJsonPath, 'utf8'));
const sourceVersion = tauriPackageJson.version;

if (!sourceVersion) {
  console.error('Error: No version found in src-tauri/package.json');
  process.exit(1);
}

const cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
const cargoMatch = cargoToml.match(/^version = "([\d.]+)"/m);
const cargoVersion = cargoMatch ? cargoMatch[1] : null;

const versions = {
  'src-tauri/package.json': sourceVersion,
  'package.json': JSON.parse(fs.readFileSync(webAppPackageJsonPath, 'utf8')).version,
  'src-tauri/tauri.conf.json': JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8')).version,
  'Cargo.toml': cargoVersion,
};

const mismatches = Object.entries(versions)
  .filter(([, version]) => version !== sourceVersion)
  .map(([file, found]) => ({ file, found, expected: sourceVersion }));

if (mismatches.length > 0) {
  console.error('Version mismatch detected!');
  mismatches.forEach(({ file, found, expected }) => {
    console.error(`  - ${file}: found "${found}", expected "${expected}"`);
  });
  process.exit(1);
}

console.log(`Version validation passed: ${sourceVersion}`);
