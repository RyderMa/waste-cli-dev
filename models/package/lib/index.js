'use strict';

const path = require('path');
const pkgDir = require('pkg-dir').sync;
const fsExtra = require('fs-extra');
const npmInstall = require('npminstall');
const pathExistsSync = require('path-exists').sync;

const { isObject } = require('@waste-cli-dev/utils');
const formatPath = require('@waste-cli-dev/format-path');
const {
  getDefaultRegistry,
  getNpmLastesVerion,
} = require('@waste-cli-dev/get-npm-info');

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
    // 缓存目录前缀
    this.cacheFilePathPrefix = this.pkgName.replace('/', '_');
  }

  get pkgCacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.pkgVersion}@${
        this.pkgName.split('/')[0]
      }`
    );
  }

  getSpecifyPkgCacheFilePath(version) {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${version}@${this.pkgName.split('/')[0]}`
    );
  }

  async prepare() {
    if (this.storeDir && !pathExistsSync(this.storeDir)) {
      // 缓存路径不存在 -> 创建
      fsExtra.mkdirpSync(this.storeDir);
    }

    if (this.pkgVersion === 'latest') {
      this.pkgVersion = await getNpmLastesVerion(this.pkgName);
    }
  }

  // plugin存在
  async exists() {
    if (this.storeDir) {
      // 缓存模式
      await this.prepare();
      return pathExistsSync(this.pkgCacheFilePath);
    } else {
      return pathExistsSync(this.targetPath);
    }
  }

  // plugin安装
  async install() {
    // TODO: 已经存在最新包或者高版本包 传入低版本时的兼容
    await this.prepare();

    return npmInstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{ name: this.pkgName, version: this.pkgVersion }],
    });
  }

  // plugin更新
  async update() {
    await this.prepare();
    const latestPkgVersion = await getNpmLastesVerion(this.pkgName);
    const latestPkgCacheFilePath =
      this.getSpecifyPkgCacheFilePath(latestPkgVersion);

    if (!pathExistsSync(latestPkgCacheFilePath)) {
      // 删除旧包
      fsExtra.removeSync(this.pkgCacheFilePath);
      return npmInstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [{ name: this.pkgName, version: latestPkgVersion }],
      });
    }

    return latestPkgCacheFilePath;
  }

  // 获取入口文件的路径
  getRootFilePath() {
    const _getRootFile = (targetPath) => {
      // 获取package.json所在目录
      const dir = pkgDir(targetPath);

      if (dir) {
        // 读取package.json
        const pkgFile = require(`${path.resolve(dir, 'package.json')}`);
        // 寻找 main/lib
        if (pkgFile?.main) {
          // 路径平台兼容
          return formatPath(path.resolve(dir, pkgFile.main));
        }
      }

      return null;
    };

    if (this.storeDir) {
      return _getRootFile(this.pkgCacheFilePath);
    } else {
      return _getRootFile(this.targetPath);
    }
  }
}

module.exports = Package;
