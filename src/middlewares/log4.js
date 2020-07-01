const log4js = require('log4js')

// 加载配置文件
log4js.configure(require('../../config/log4'))

// 封装错误日志
const errorLogger = function(ctx, error, resTime) {
  if (ctx && error) {
    log4js.getLogger('error').error(formatError(ctx, error, resTime))
  }
}

// 封装响应日志
const requestLogger = function(ctx, resTime) {
  if (ctx) {
    log4js.getLogger('request').debug(formatRes(ctx, resTime))
  }
}

// 格式化请求日志 (不支持表单, 文件)
const formatRes = function(ctx, resTime) {
  const text = `${ctx.request.ip}
${ctx.status}: ${resTime}ms
${ctx.method}: ${ctx.originalUrl}
${JSON.stringify(ctx.request.body)}
${JSON.stringify(ctx.body)}`
  return text
}

// 格式化错误日志
const formatError = function(ctx, err, resTime) {
  const text = `${ctx.request.ip}
${ctx.status}: ${resTime}ms
${ctx.method}: ${ctx.originalUrl}
${JSON.stringify(ctx.request.body)}
${err.stack}`
  return text
}

// 格式化响应日志
const formatReq = function(ctx, resTime) {
  const text = `
${ctx.body}`
  return text
}

const logger = async (ctx, next) => {
  // 响应开始时间
  const start = new Date()
  // 响应间隔时间
  let ms
  try {
    // 开始进入到下一个中间件
    await next()
    ms = new Date() - start
    requestLogger(ctx, ms)
  } catch (error) {
    ms = new Date() - start
    errorLogger(ctx, error, ms)
  }
}

module.exports = logger
