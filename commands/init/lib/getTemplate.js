const request = require('@waste-cli-dev/request')

module.exports = function() {
  return request({
    url: '/templates'
  })
}