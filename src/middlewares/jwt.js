// jwt
const koajwt = require('koa-jwt')
const config = require('@root/config/index.js')
const { ignoreTokenPaths } = require('@/core/routerLoader.js')

module.exports = function (options) {
  return koajwt({ secret: config.jwt.secret }).unless({
    path: ignoreTokenPaths,
  })
}
