// 自动解析resquset的body
const bodyparser = require('koa-bodyparser')

module.exports = function (options) {
  return bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
}
