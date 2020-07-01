const utils = require('../utils/utils')
const {
  GET,
  POST,
  WARP,
  ROUTER,
  STATE,
  INGORETOKEN,
  CACHE,
  DIRTYCACHE,
} = require('../core/routerLoader')

const check_a = async (ctx, next) => {
  const a = ctx.request.query.a
  // 500: http错误码
  // 1000: 业务错误码
  ctx.assert(a, 500, 'a不能为空', { code: 1000 })
  await next()
}

// 修改路径名称
// @ROUTER('/demo')
@INGORETOKEN() // 忽略jwt的验证
class demo {
  // get请求
  @GET()
  @STATE('aaa', 123) // 通过STATE给ctx.state添加参数
  async hello(ctx, next) {
    const a = ctx.request.query.a
    ctx.body = { 'state.aaa': ctx.state.aaa, a: a }
  }

  // post请求
  @POST()
  async helloPost(ctx, next) {
    const a = ctx.request.body.a
    ctx.body = {
      a,
    }
  }

  // 修改路径名称
  @GET('/helloWorld')
  async hello2(ctx, next) {
    ctx.body = 'hello world'
  }

  // 抛出异常
  @GET()
  async error(ctx, next) {
    ctx.throw(501, '你得到了一个错误', { code: 1000 })
  }

  @GET()
  async longTime(ctx, next) {
    console.log('start')
    await utils.sleep(3000)
    console.log('end')

    ctx.body = '3000ms'
  }

  @GET()
  @STATE('_ignoreFormat', true) // 忽略response格式化, 用于返回文件
  async ignoreFormat(ctx, next) {
    ctx.body = 'ignore response formatting'
  }

  // 添加warp
  @WARP(check_a)
  @GET()
  async check(ctx, next) {
    ctx.body = {
      username: '骨傲天',
      age: 30,
    }
  }

  @GET()
  // 使用@CACHE, 对get请求添加缓存
  @CACHE('aaa')
  async cache(ctx, next) {
    ctx.body = {
      random: Math.ceil(Math.random() * 100),
    }
  }

  @GET()
  // 使用DIRTYCACHE, 删除缓存
  async dirtyCache(ctx, next) {
    ctx.body = {
      msg: 'cache breakdown',
    }
    DIRTYCACHE('aaa')
  }
}

module.exports = demo
