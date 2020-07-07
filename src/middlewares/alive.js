// 校验请求的前缀
module.exports = function (options) {
  const paths = ['/status', '/index.html', '/check']

  return async (ctx, next) => {
    if (paths.indexOf(ctx.originalUrl) !== -1) {
      ctx.body = 'ok'
      return
    }
    await next()
  }
}
