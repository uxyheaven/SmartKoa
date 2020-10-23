// redis
module.exports = function (app, options) {
  const redis = require('@/utils/redis')
  redis.init()
}
