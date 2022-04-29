'use strict';

const log = require('@waste-cli-dev/log');
const Package = require('@waste-cli-dev/package');

const SETTINGS = {
  init: '@waste-cli-dev/init',
};

function exec() {
  console.log('exec...');
  const homePath = process.env.CLI_HOME_PATH;
  log.verbose('homePath', homePath);
  const targetPath = process.env.CLI_TARGET_PATH;
  log.verbose('targetPath', targetPath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const pkgName = SETTINGS[cmdName];
  const pkgVersion = 'lastest';

  if (!targetPath) {
    targetPath = ''; // 缓存路径
  }

  const pkg = new Package({
    pkgName,
    pkgVersion,
    storePath: homePath,
    targetPath,
  });

	console.log('pkgdir', pkg.getRootFilePath());
}

module.exports = exec;

