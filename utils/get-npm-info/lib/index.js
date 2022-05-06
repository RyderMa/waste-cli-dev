'use strict';

module.exports = {
  getNpmInfo,
  getDefaultRegistry,
};

function getNpmInfo() {
  // TODO
}

function getDefaultRegistry(isOriginal = true) {
  return isOriginal
    ? 'https://registry.npmjs.org'
    : 'https://registry.npm.taobao.org';
}
