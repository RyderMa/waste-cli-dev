'use strict';

module.exports = core;

const path = require('path');
const log = require('@waste-cli-dev/log');
const colors = require('colors/safe');
const semver = require('semver');
const userHome = require('user-home');
const commander = require('commander');
const pathExists = require('path-exists').sync;

const pkg = require('../package.json');
const { LOWEST_NODE_VERSION, DEFAULT_CLI_HOME } = require('./constant');

let argv = {},
  config;

const program = new commander.Command();
const init = require('@waste-cli-dev/init') 

function core() {
  try {
    checkVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    // checkInputArgs();
    checkEnv();
    regitsterCommand();
  } catch (error) {
    log.error(error.message);
  }
}

function regitsterCommand() {
  program
    .name(Object.keys(pkg.bin)?.[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d  --debug', '是否开启调试模式');

  program.command('init [projectName]').option('-f --force', '强制覆盖').action(init);

  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose('debug', 'test debug log');
  });

  program.on('command:*', (obj) => {
    console.log(colors.red(`未知的命令: ${obj[0]}`));
    console.log(
      colors.green(
        `试试这些命令: ${program.commands
          .map((item) => item?.name())
          .join(', ')}`
      )
    );
  });

  program.parse(process.argv);

  if (program.args?.length < 1) {
    program.outputHelp();
  }
}

function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');

  if (pathExists(dotenvPath)) {
    config = dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig();
  log.verbose('环境变量', config);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig.cliHome = path.join(userHome, DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

function checkInputArgs() {
  const minimist = require('minimist');
  argv = minimist(process.argv.slice(2));
  checkArgs();
}

function checkArgs() {
  if (argv.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在!'));
  }
}

function checkRoot() {
  const rootCheck = require('root-check');
  // console.log(rootCheck());
}

function checkVersion() {
  log.notice('version', pkg.version);
}

function checkNodeVersion() {
  const currentNodeVersion = process.version;
  if (!semver.gte(currentNodeVersion, LOWEST_NODE_VERSION)) {
    throw new Error(
      colors.red(
        `waste-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`
      )
    );
  }
}
