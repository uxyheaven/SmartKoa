// 服务
const service = {}
const assert = require('http-assert')

service.init = () => {
  console.log('Demo service init')
}

service.add = (a, b) => {
  return a + b
}

service.division = (a, b) => {
  // 500: http错误码
  // 1000: 业务错误码
  assert(b != 0, 500, 'b不能为0', { code: 1000 })
  return a / b
}

module.exports = service
