'use strict';

const semver = require('semver');
const colors = require('colors/safe');
const log = require('@waste-cli-dev/log');
const { isObject } = require('@waste-cli-dev/utils');

const LOWEST_NODE_VERSION = '12.0.0';

class Command {
  constructor(argv) {
    if (!argv) {
      throw new Error('初始化参数不能为空');
    }
		if(!Array.isArray(argv)) {
			throw new Error('初始化参数必须是数组类型');
		}
		if(argv.length < 1) {
			throw new Error('初始化参数数组为空');
		}
    this._argv = argv;
    const runner = new Promise((resovle, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => log.error(err));
    });
  }

	initArgs() {
		this.cmd = this._argv.pop()
	}

  checkNodeVersion() {
    const currentNodeVersion = process.version;
    if (!semver.gte(currentNodeVersion, LOWEST_NODE_VERSION)) {
      throw new Error(
        colors.red(
          `waste-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`
        )
      );
    }
  }

  init() {
    throw new Error('init必须实现');
  }

  exec() {
    throw new Error('exec必须实现');
  }
}

module.exports = Command;
