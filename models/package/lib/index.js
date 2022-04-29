'use strict';

const path = require('path');
const pkgDir = require('pkg-dir').sync;

const { isObject } = require('@waste-cli-dev/utils');
class Package {
  /**
   * @param {{name: string, version: string, storePath: string, targetPath: string}} options
   */
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('Package类构造函数入参不正确!');
    }
    const { pkgName, pkgVersion, targetPath } = options;
    this.pkgName = pkgName;
    this.pkgVersion = pkgVersion;
    // this.storePath = storePath;
    this.targetPath = targetPath;
  }

  // plugin存在
  exists() {}

  // plugin安装
  install() {}

  // plugin更新
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {
    console.log('this.targetPath', this.targetPath);
    // 获取package.json所在目录
    const dir = pkgDir(this.targetPath);

    if (dir) {
      const pkgFile = require(path.resolve);
      // 读取package.json
      // 寻找 main/lib
      // 路径平台兼容
    }

    return null;
  }
}

module.exports = Package;
