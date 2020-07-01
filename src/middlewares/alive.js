// 校验请求的前缀
module.exports = function(params) {
  const { paths } = params

  return async (ctx, next) => {
    if (paths.indexOf(ctx.originalUrl) !== -1) {
      ctx.body = 'ok'
      return
    }
    await next()
  }
}
