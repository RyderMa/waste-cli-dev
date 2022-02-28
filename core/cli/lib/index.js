'use strict';

module.exports = core;

const pkg = require('../package.json');

const log = require('@waste-cli-dev/log');

function core() {
  checkVersion();
}

function checkVersion() {
  console.log(pkg.version);
  log.success('success', 'aaaaaa');
}
