'use strict';

module.exports = core;

const path = require('path');
const log = require('@waste-cli-dev/log');
const colors = require('colors/safe');
const semver = require('semver');
const userHome = require('user-home');
const commander = require('commander');
const pathExists = require('path-exists').sync;
const init = require('@waste-cli-dev/init');
const exec = require('@waste-cli-dev/exec');

const pkg = require('../package.json');
const {
  DEFAULT_CLI_HOME,
  NPM_NAME,
} = require('./constant');

let argv = {},
  config;

const program = new commander.Command();

async function core() {
  try {
    await prepare();
  } catch (error) {
    log.error(error.message);
    if (program.opts().debug) {
      console.error(error);
    }
  }
}

function regitsterCommand() {
  program
    .name(Object.keys(pkg.bin)?.[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d  --debug', '是否开启调试模式')
    .option('-tp --targetPath <targetPath>', '是否指定本地调试文件路径', '');

  program
    .command('init [projectName]')
    .option('-f --force', '强制覆盖')
    .action(exec);

  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
  });

  program.on('option:targetPath', () => {
    if (program.opts().targetPath) {
      // init command 使用
      process.env.CLI_TARGET_PATH = program.opts().targetPath;
    }
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

async function prepare() {
  checkVersion();
  checkRoot();
  checkUserHome();
  checkEnv();
  regitsterCommand();
  await checkGlobalUpdate();
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

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在!'));
  }
}

function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck();
}

function checkVersion() {
  log.notice('version', pkg.version);
}

async function checkGlobalUpdate() {
  log.verbose('检查 waste-cli 版本');
  const currentVersion = pkg.version;
  // const lastVersion = await npm.getNpmLatestSemverVersion(
  //   NPM_NAME,
  //   currentVersion
  // );
}
