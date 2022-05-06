'use strict';

const path = require('path');

const log = require('@waste-cli-dev/log');
const Package = require('@waste-cli-dev/package');

const SETTINGS = {
  // init: '@waste-cli-dev/init',
  init: '@imooc-cli/init',
};

const CACHE_DIR = 'dependencies';

function exec() {
  console.log('exec...');
  const homePath = process.env.CLI_HOME_PATH;
  let targetPath = process.env.CLI_TARGET_PATH;
  let storeDir = '';
  let pkg = null;

  log.verbose('homePath', homePath);
  log.verbose('targetPath', targetPath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const pkgName = SETTINGS[cmdName];
  const pkgVersion = 'lastest';

  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR);
    // 缓存路径
    storeDir = path.resolve(targetPath, 'node_modules');

    log.verbose('storeDir', storeDir);
    log.verbose('targetPath', targetPath);

    pkg = new Package({
      pkgName,
      storeDir,
      pkgVersion,
      targetPath,
    });

    if (pkg.exists()) {
      // 更新package
      // pkg.update();
    } else {
      // 安装packge
      pkg.install();
    }
  } else {
    pkg = new Package({
      pkgName,
      pkgVersion,
      targetPath,
    });
  }

  const rootFile = pkg.getRootFilePath();
  console.log('-------------rootFile-------------', rootFile);
  require(rootFile)?.(...arguments);
}

module.exports = exec;
