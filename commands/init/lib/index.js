'use strict';

module.exports = init;

function init(projectName, options, command) {
  if (options.force) {
    console.log('force ...');
  }
  // TODO
  console.log('init ...', projectName, options, process.env.CLI_TARGET_PATH);
}
