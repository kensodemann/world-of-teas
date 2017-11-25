'use strict';

const adjNoun = require('adj-noun');
const fs = require('fs');
const moment = require('moment');
const semver = require('semver');

const packageFile = './package.json';
const versionFile = './src/assets/version.json';
let pkg;

function getBumpType() {
  const lastArg = process.argv[process.argv.length - 1];
  if (['prerelease', 'patch', 'minor', 'major'].includes(lastArg)) {
    return lastArg;
  }
  return 'prerelease';
}

function nextVersion(releaseType) {
  return semver.inc(pkg.version, releaseType);
}

function readPackage() {
  return JSON.parse(fs.readFileSync(packageFile, 'utf8'));
}

function writePackage() {
  fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
  fs.appendFileSync(packageFile, '\n');
}

function writeVersionFile() {
  adjNoun.seed(moment().valueOf());
  const version = {
    version: pkg.version,
    name: adjNoun().join(' '),
    date: moment().format('YYYY-MM-DD')
  };
  fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
  fs.appendFileSync(versionFile, '\n');
}

const type = getBumpType();
pkg = readPackage();
pkg.version = nextVersion(type);
writePackage();
writeVersionFile();
