// 连接数据库, 加载数据模型, ModelLoader
// todo: 适配多个数据库
module.exports = function (app, options) {
  const modelLoader = require('@/core/modelLoader')
  modelLoader.init() // 这个需要先执行, 然后后续的模块才可以取得model
}
