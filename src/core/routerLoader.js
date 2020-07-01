/**
 * 路由loader
 * loader将自动加载controllers文件夹下的路由
 */

const glob = require('glob')
const path = require('path')

const routerLoader = {}
let router
let ignoreTokenPaths = []

// 初始化附加值
const initAppend = (target, name) => {
  !target._routes && (target._routes = {})
  name && !target._routes[name] && (target._routes[name] = {})
}
const initWarps = (target, name) => {
  !target._routes[name].warps && (target._routes[name].warps = [])
}

routerLoader.init = function (params) {
  const dir = path.join(__dirname, '../controllers')
  router = require('koa-router')({
    prefix: params.prefix,
  })

  const files = glob.sync(dir + '/*.js')

  for (const file of files) {
    const name = path.basename(file, '.js')
    if (name.indexOf('_') === 0) continue

    const clazz = require(`../controllers/${name}`)

    const tmpRouter = require('koa-router')()

    // console.log(
    //   'clazz:',
    //   clazz.name,
    //   clazz.prototype._routePath,
    //   clazz.prototype._routes,
    // )

    const _routePath = clazz.prototype._routePath
      ? clazz.prototype._routePath
      : `/${name}`

    const methods = Object.getOwnPropertyDescriptors(clazz.prototype)
    for (let methodName in methods) {
      if (methodName.startsWith('_') || methodName === 'constructor') continue

      const options = clazz.prototype._routes[methodName]
      if (!options) continue
      // console.log('options:', options)

      const fn = methods[methodName].value
      // 添加 warps
      const warps = clazz.prototype._routes[methodName].warps
      if (warps && warps.length > 0) {
        tmpRouter[options.method](options.path, ...warps, fn)
      } else {
        tmpRouter[options.method](options.path, fn)
      }

      // 添加忽略验证的列表
      if (
        clazz.prototype._ingoreToken ||
        clazz.prototype._routes[methodName]._ingoreToken
      ) {
        let ignoreTokenPath = `${params.prefix}${_routePath}/${methodName}`
        ignoreTokenPaths.push(ignoreTokenPath)
      }
    }

    router.use(_routePath, tmpRouter.routes(), tmpRouter.allowedMethods())
  }

  router.all('*', async (ctx, next) => {
    ctx.status = 404
  })

  return router
}

const request = (method = 'get', path = '') => (target, name, descriptor) => {
  initAppend(target, name)

  target._routes[name].method = method
  target._routes[name].path = !!path ? `${path}` : `/${name}`

  return descriptor
}

// http method
const GET = path => request('get', path)
const POST = path => request('post', path)
const PUT = path => request('put', path)
const DELETE = path => request('delete', path)
const ALL = path => request('all', path)
const HEAD = path => request('head', path)
const OPTIONS = path => request('options', path)
const PATCH = path => request('patch', path)

/** 修改路径名称, 可以写在class or method中
 * @description path : 路径x
 */
const ROUTER = path => target => {
  path && (target.prototype._routePath = path)
}

// koa

/** 给路由中的方法添加一个拦截方法
 * @description fn : 拦截方法
 */
const WARP = fn => (target, name, descriptor) => {
  initAppend(target, name)
  initWarps(target, name)

  target._routes[name].warps.push(fn)

  return descriptor
}

/** 给ctx.state添加一个值
 * @description key : key
 * @description value : value
 */
const STATE = (key, value) => (target, name, descriptor) => {
  initAppend(target, name)
  initWarps(target, name)

  const fn = async (ctx, next) => {
    ctx.state[key] = value
    await next()
  }
  target._routes[name].warps.push(fn)

  return descriptor
}

/** 忽略token验证,可以写在class or method中
 * 本项目用的是jwt
 */
const INGORETOKEN = () => (target, name, descriptor) => {
  if (name === undefined) {
    // 加在class上
    target.prototype._ingoreToken = true

    return descriptor
  } else {
    initAppend(target, name)

    // 加在class的方法上
    target._routes[name]._ingoreToken = true

    return descriptor
  }
}

// cache中间件
// 使用redis, 对get请求添加缓存
const redis = require('../utils/redis')

/** 添加缓存
 * @description key : 缓存名
 * @description expire : 过期时间
 */
const CACHE = (key, expire) => (target, name, descriptor) => {
  initAppend(target, name)
  initWarps(target, name)

  const _cache = async (ctx, next) => {
    if (ctx.request.method !== 'GET') {
      await next()
      return
    }

    let result = await redis.getObject(key)
    if (result == null) {
      await next()
      let value = ctx.body
      value = JSON.stringify(value)
      await redis.setObject(key, value, expire)
      return
    }

    result = JSON.parse(result)
    ctx.body = result
  }

  target._routes[name].warps.push(_cache)

  return descriptor
}

/** 删除缓存
 * @description uuid(8, 16)  :  "098F4D35"
 */
const DIRTYCACHE = async key => {
  await redis.del(key)
}

module.exports = {
  routerLoader,
  // http method
  GET,
  POST,
  PUT,
  DELETE,
  ALL,
  HEAD,
  OPTIONS,
  PATCH,
  // koa
  ROUTER,
  WARP,
  STATE,
  INGORETOKEN,
  CACHE,
  DIRTYCACHE,
  //
  ignoreTokenPaths,
}
