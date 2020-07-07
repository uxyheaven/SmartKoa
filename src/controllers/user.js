const { GET, POST, ROUTER, INGORETOKEN } = require('@/core/routerLoader')
const jsonwebtoken = require('jsonwebtoken')
const config = require('@root/config/index.js')

const chech_a = async (ctx, next) => {
  const a = ctx.request.query.a
  ctx.assert(a, 500, 'a不能为空', { code: 1000 })
  next()
}

const USER = {
  username: 'aaa',
  password: '123456',
  id: '001',
}
class user {
  @GET()
  async getUser(ctx, next) {
    ctx.body = {
      username: '骨傲天',
      age: 30,
    }
  }

  @POST()
  @INGORETOKEN()
  async login(ctx, next) {
    // 判断用户名密码是否匹配，为简单起见，直接使用常量
    let checkUser =
      ctx.request.body.username == USER.username &&
      ctx.request.body.password == USER.password

    if (!checkUser) {
      ctx.throw(200, '用户名或密码错', { code: 10001 })
    }

    let userToken = { name: USER.username, id: USER.id }
    ctx.body = {
      msg: '登录成功',
      token: jsonwebtoken.sign(userToken, config.jwt.secret, {
        expiresIn: config.jwt.expired,
      }),
    }
  }
}

module.exports = user
