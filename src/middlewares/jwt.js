// jwt 排除的路径
const koajwt = require('koa-jwt')
const config = require('../../config/index.js')
const { ignoreTokenPaths } = require('../core/routerLoader.js')

module.exports = koajwt({ secret: config.jwt.secret }).unless({
  path: ignoreTokenPaths,
})
