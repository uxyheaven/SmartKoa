const { GET, POST, ROUTER, INGORETOKEN } = require('../core/routerLoader')
const config = require('../../config/index.js')

// 加载Model
const { Product } = require('../core/modelLoader.js')

@INGORETOKEN() // 忽略jwt的验证
class product {
  // 查
  @GET()
  async product(ctx, next) {
    const id = ctx.request.query.id
    let result = null
    if (!!id) {
      result = await Product.findOne({
        where: { id: id },
      })

      ctx.body = result
      return
    }

    result = await Product.findAndCountAll({
      where: {},
      order: [['createdAt', 'DESC']], // 排序
      // paranoid: false, // 包含软删除记录
      offset: 0, // 偏移
      limit: 20, // 数量限制
    })
    ctx.body = result
    return
  }

  // 增
  @POST()
  async add(ctx, next) {
    const name = ctx.request.body.name
    const result = await Product.create({
      name: name,
    })

    ctx.body = result
  }

  // 删
  @POST()
  async delete(ctx, next) {
    const id = ctx.request.body.id
    let result = await Product.destroy({
      where: { id: id },
    })

    ctx.body = result
  }

  // 改
  @POST()
  async update(ctx, next) {
    const id = ctx.request.body.id
    const name = ctx.request.body.name
    let result = await Product.update(
      { name: name },
      {
        where: { id: id },
      },
    )

    ctx.body = result
  }
}

module.exports = product
