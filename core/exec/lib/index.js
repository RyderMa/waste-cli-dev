'use strict';

const path = require('path');

const cp = require('child_process');
const log = require('@waste-cli-dev/log');
const Package = require('@waste-cli-dev/package');

const SETTINGS = {
  // init: '@waste-cli-dev/init',
  // init: '@vue/reactivity',
  init: 'dayjs',
};

const CACHE_DIR = 'dependencies';

async function exec() {
  const homePath = process.env.CLI_HOME_PATH;
  let targetPath = process.env.CLI_TARGET_PATH;
  let storeDir = '';
  let pkg = null;

  log.verbose('homePath', homePath);
  log.verbose('targetPath', targetPath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const pkgName = SETTINGS[cmdName];
  const pkgVersion = 'latest'; // 默认最新版

  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR);
    // 缓存路径
    storeDir = path.resolve(targetPath, 'node_modules');

    log.verbose('storeDir', storeDir);
    log.verbose('homePath -> targetPath', targetPath);

    pkg = new Package({
      pkgName,
      storeDir,
      pkgVersion,
      targetPath,
    });

    if (await pkg.exists()) {
      // 更新package
      await pkg.update();
    } else {
      // 安装packge
      await pkg.install();
    }
  } else {
    pkg = new Package({
      pkgName,
      pkgVersion,
      targetPath,
    });
  }

  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    try {
      const args = Array.from(arguments);
      const cmd = args.pop();
      const filterCmd = Object.create(null);

      Object.keys(cmd).forEach((key) => {
        if (
          cmd.hasOwnProperty(key) &&
          !key.startsWith('_') &&
          key !== 'parent'
        ) {
          filterCmd[key] = cmd[key];
        }
      });
      args.push(filterCmd);

      const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`;
      // 子进程 多核利用
      const child = cp.spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit',
      });

      child.on('error', (err) => {
        log.error(err);
        process.exit(1);
      });

      child.on('exit', (code, signal) => {
        log.verbose('命令执行成功', code, signal);
        process.exit(code);
      });
    } catch (error) {
      log.error(error);
    }
  }
}

// function spawn(command, args, options = {}) {
//   const win32 = process.platform === 'win32';

//   const cmd = win32 ? 'cmd' : command;
//   const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
//   console.log('cmd', cmd);
//   console.log('cmdArgs', cmdArgs);
//   return cp.spawn(command, cmdArgs, options);
// }

module.exports = exec;
