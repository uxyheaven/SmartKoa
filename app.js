const Koa = require('koa')
const app = new Koa()

// require路径别名
require('module-alias/register')

// todo: babel-register 性能问题
require('@babel/register')({
  only: [/controllers/],
  cache: false,
})

const config = require('./config')

const program = require('commander')
program.version('0.1.0').option('--test', '运行测试代码').parse(process.argv)

// 插件
require('@/core/pluginsLoader.js').init(app)

// 中间件
require('@/core/middlewaresLoader.js').init(app)

// ServiceLoader
// const serviceLoader = require('@/core/serviceLoader')
// serviceLoader.init()

// ExtendLoader
// const extendLoader = require('@/core/extendLoader')
// extendLoader.init()

// 连接数据库, 加载数据模型, ModelLoader

// 跨域问题

// 健康检测

// 自动解析resquset的body

// 美化返回的json数据

// 静态资源
// const koaStatic = require('koa-static')
// app.use(koaStatic(`${__dirname}/public`))

// 日志

// 过滤前缀

// 格式化response输出

// jwt

// 路由1 -- 初始化, 这有个坏味道, 因为jwt需要用到里面的值
const { routerLoader } = require('@/core/routerLoader')
const router = routerLoader.init({
  prefix: '/api',
})
// 路由2 -- 绑定
app.use(router.routes(), router.allowedMethods())

// user 中间件
const user = require('@/middlewares/user')
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
  require('@/core/testLoader').test()
}

module.exports = app
