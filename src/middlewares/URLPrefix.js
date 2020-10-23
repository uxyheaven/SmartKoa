// 过滤前缀
module.exports = function (options) {
  const { prefix } = options
  return async (ctx, next) => {
    if (prefix && ctx.originalUrl.indexOf(prefix) !== 0) {
      ctx.throw(404)
    }
    await next()
  }
}
