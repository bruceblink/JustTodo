#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const tauriPackageJsonPath = path.join(__dirname, '../src-tauri/package.json');
const webAppPackageJsonPath = path.join(__dirname, '../package.json');
const tauriConfigPath = path.join(__dirname, '../src-tauri/tauri.conf.json');
const cargoTomlPath = path.join(__dirname, '../Cargo.toml');

const tauriPackageJson = JSON.parse(fs.readFileSync(tauriPackageJsonPath, 'utf8'));
const version = tauriPackageJson.version;

if (!version) {
  console.error('Error: No version found in src-tauri/package.json');
  process.exit(1);
}

const webAppPackageJson = JSON.parse(fs.readFileSync(webAppPackageJsonPath, 'utf8'));
webAppPackageJson.version = version;
fs.writeFileSync(webAppPackageJsonPath, JSON.stringify(webAppPackageJson, null, 2) + '\n');

const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));
tauriConfig.version = version;
fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');

let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
cargoToml = cargoToml.replace(/^version = "[\d.]+"/m, `version = "${version}"`);
fs.writeFileSync(cargoTomlPath, cargoToml);

console.log(`Version synced to ${version}`);
