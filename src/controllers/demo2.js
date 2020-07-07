const utils = require('@/utils/utils')
const {
  GET,
  POST,
  WARP,
  ROUTER,
  STATE,
  INGORETOKEN,
  CACHE,
  DIRTYCACHE,
} = require('@/core/routerLoader')

const service = require('@/services/demo2.js')

const check_a = async (ctx, next) => {
  const a = ctx.request.query.a
  ctx.assert(a, 500, 'a不能为空', { code: 1000 })
  await next()
}

// 修改路径名称
// @ROUTER('/demo')
@INGORETOKEN() // 忽略jwt的验证
class demo2 {
  @GET()
  async add(ctx, next) {
    const { a, b } = ctx.request.query
    ctx.body = service.add(a, b)
  }

  @GET()
  async division(ctx, next) {
    const { a, b } = ctx.request.query
    ctx.body = service.division(a, b)
  }
}

module.exports = demo2
