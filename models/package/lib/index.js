'use strict';

const path = require('path');
const pkgDir = require('pkg-dir').sync;
const npmInstall = require('npminstall');

const { isObject } = require('@waste-cli-dev/utils');
const formatPath = require('@waste-cli-dev/format-path');
const { getDefaultRegistry } = require('@waste-cli-dev/get-npm-info');

class Package {
  /**
   * @param {{name: string, version: string, storeDir: string, targetPath: string}} options
   */
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('Package类构造函数入参不正确!');
    }
    const { pkgName, pkgVersion, storeDir, targetPath } = options;
    this.pkgName = pkgName;
    this.storeDir = storeDir;
    this.pkgVersion = pkgVersion;
    this.targetPath = targetPath;
  }

  // plugin存在
  exists() {}

  // plugin安装
  install() {
    npmInstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{ name: this.pkgName, version: this.pkgVersion }],
    });
  }

  // plugin更新
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {
    // 获取package.json所在目录
    const dir = formatPath(pkgDir(this.targetPath));

    if (dir) {
      // 读取package.json
      const pkgFile = require(path.resolve(dir, 'package.json'));
      // 寻找 main/lib
      if (pkgFile?.main) {
        // 路径平台兼容
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }

    return null;
  }
}

module.exports = Package;
