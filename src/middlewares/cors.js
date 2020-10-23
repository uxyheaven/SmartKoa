// 跨域
const cors = require('koa2-cors')

module.exports = function (options) {
  return cors({
    origin: function (ctx) {
      return '*'
      // return 'http://localhost:9540'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
}
