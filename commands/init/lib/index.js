'use strict';

const log = require('@waste-cli-dev/log')
const Command = require('@waste-cli-dev/command')

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] ?? ''
    this.force = this._argv[1]?.force
    log.verbose('projectName', this.projectName)
    log.verbose('force', this.force)
  }
}

function init(argv) {
  return new InitCommand(argv)
  // if (options.force) {
  //   console.log('force ...');
  // }
  // // TODO
  // console.log('init ...', projectName, options, process.env.CLI_TARGET_PATH);
}

module.exports = init;