'use strict';

const log = require('@waste-cli-dev/log');
const Command = require('@waste-cli-dev/command');
const fs = require('fs');
const fsExtra = require('fs-extra');
const inquirer = require('inquirer');

const TYPE_PROJECT = 'porject';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] ?? '';
    this.force = this._argv[1]?.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  async exec() {
    try {
      const ret = await this.prepare();
      console.log('exec', ret);
      if (ret) {
        // 下载模板
        // 安装模板
      }
    } catch (error) {
      log.error(error);
    }
  }

  async prepare() {
    // 判断当前目录是否为空
    const localPath = process.cwd(); // or path.resolve('.')

    if (!this.isDirEmpty(localPath)) {
      let isContinue = false;

      if (!this.force) {
        const answer = await inquirer
          .prompt([
            {
              name: 'isContinue',
              type: 'confirm',
              default: false,
              message: '当前文件夹不为空, 是否继续创建项目?',
            },
          ])
          .catch((error) => {
            log.verbose('继续创建 error:', error);
          });
        isContinue = answer?.isContinue;

        if (!isContinue) return; // 终止创建
      }

      // 是否强制更新
      if (isContinue || this.force) {
        const answer = await inquirer
          .prompt([
            {
              name: 'confirmDelete',
              type: 'confirm',
              default: false,
              message: '是否确认清空当前目录下的文件?',
            },
          ])
          .catch((error) => {
            log.verbose('继续创建 error:', error);
          });

        answer?.confirmDelete && fsExtra.emptyDirSync(localPath);
      }
    }

    const projectType = await this.getProjectInfo();
  }

  async getProjectInfo() {
    const projectInfo = {};
    // 选择创建的项目和组件
    const typeAnswer = await inquirer.prompt({
      name: 'type',
      type: 'list',
      default: TYPE_PROJECT,
      message: '请选择初始化类型',
      choices: [
        { name: '项目', value: TYPE_PROJECT },
        { name: '组件', value: TYPE_COMPONENT },
      ],
    });

    const type = typeAnswer?.type;

    // 获取项目的基本信息
    if (type === TYPE_PROJECT) {
      const info = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '请输入项目名称',

          validate: (val) => {
            const reg = /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/;
            if (!reg.test(val)) return '文件名不合规';
            return true
          },
          filter: (val) => {
            return val.trim();
          },
        },
        {
          type: 'input',
          name: 'version',
          message: '请输入项目版本号',
          validate: (val) => {
            if(!val.includes('.')) return '版本号不合规'
            return typeof val === 'string';
          },
          filter: (val) => {
            return val.trim();
          },
        },
      ]);
    } else if (type === TYPE_COMPONENT) {
    }

    return projectInfo;
  }

  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);

    const filterFileNames = ['node_modules'];
    fileList = fileList.filter(
      (fileName) =>
        !fileName.startsWith('.') && !filterFileNames.includes(fileName)
    );

    return !fileList || fileList.length < 1;
  }
}

function init(argv) {
  return new InitCommand(argv);
  // if (options.force) {
  //   console.log('force ...');
  // }
  // // TODO
  // console.log('init ...', projectName, options, process.env.CLI_TARGET_PATH);
}

module.exports = init;
