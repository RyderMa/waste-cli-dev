'use strict';

module.exports = formatPath;

const path = require('path')

function formatPath(path) {
	if(path && typeof path === 'string') {
		const seq = path.seq
		if(seq === '/') {
			return path
		} else {
			return path.replace(/\\/g, '/')
		}
	}
  return '';
}
