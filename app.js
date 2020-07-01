const Koa = require('koa')
const app = new Koa()

// todo: babel-register 性能问题
require('@babel/register')({
  only: [/controllers/],
  cache: false,
})

const config = require('./config')

const program = require('commander')
program
  .version('0.1.0')
  .option('--test', '运行测试代码')
  .parse(process.argv)

// ServiceLoader
const serviceLoader = require('./src/core/serviceLoader')
serviceLoader.init()

// ExtendLoader
const extendLoader = require('./src/core/extendLoader')
extendLoader.init()

// redis
if (config.redis.enable) {
  const redis = require('./src/utils/redis')
  redis.init()
}

// 连接数据库, 加载数据模型, ModelLoader
// todo: 适配多个数据库
if (config.mysql.enable) {
  const modelLoader = require('./src/core/modelLoader')
  modelLoader.init() // 这个需要先执行, 然后后续的模块才可以取得model
}

// error handler
const onerror = require('koa-onerror')
onerror(app)

// 跨域问题
if (config.cors.enable) {
  const cors = require('./src/middlewares/cors')
  app.use(cors)
}

// 健康检测
const alive = require('./src/middlewares/alive')({
  paths: ['/status', '/index.html', '/check'],
})
app.use(alive)

// 自动解析resquset的body
const bodyparser = require('koa-bodyparser')
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  }),
)

// 美化返回的json数据
const json = require('koa-json')
app.use(json())

// 静态资源
const koaStatic = require('koa-static')
app.use(koaStatic(`${__dirname}/public`))

// 日志
if (config.log.enable) {
  const logger = require('./src/middlewares/log4')
  app.use(logger)
}

// 过滤前缀
const prefix = require('./src/middlewares/URLPrefix')({
  prefix: '/api/',
})
app.use(prefix)

// 格式化response输出
const responseFormatter = require('./src/middlewares/responseFormatter')
app.use(responseFormatter)

// 路由1 -- 初始化, 这有个坏味道, 因为jwt需要用到里面的值
const { routerLoader } = require('./src/core/routerLoader')
const router = routerLoader.init({
  prefix: '/api',
})

if (config.jwt.enable) {
  // jwt
  const jwt = require('./src/middlewares/jwt')
  app.use(jwt)
}

// 路由2 -- 绑定
app.use(router.routes(), router.allowedMethods())

// user 中间件
const user = require('./src/middlewares/user')
app.use(user)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

console.log('config:')
console.log(config)
console.log(`env = ${config.env}`)
console.log(`port = ${config.port}`)
console.log('########## server start ##########\n')

// test
if (program.test) {
  require('./src/core/testLoader').test()
}

module.exports = app
