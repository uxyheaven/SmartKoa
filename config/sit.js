/**
 * sit环境的配置内容
 */

module.exports = {
  // 环境名称
  env: 'sit',
  // 服务端口号
  port: 8080,

  // 数据库
  mysql: {
    enable: false,
    url: 'localhost',
    user: 'root',
    psw: '123456',
    db_name: 'wheel',
  },

  // redis
  redis: {
    enable: false,
    sentinelsEnable: false,
    // 哨兵
    sentinels: [{ host: '', port: '' }],
    name: '',
    url: '',
    port: 8080,
    password: '',
  },

  // jwt
  jwt: {
    enable: false,
    secret: '123456',
    expired: '23h',
  },

  // log
  log: {
    enable: true,
  },

  // cors
  cors: {
    enable: false,
  },
}