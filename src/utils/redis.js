const Redis = require('ioredis')
const config = require('../../config')

let redis
let isReady = false

function init(namespace = '') {
  let ns = namespace
  if (process.env.NODE_ENV === 'development') {
    ns = 'dev_' + namespace
  }
  if (config.redis.sentinelsEnable) {
    redis = new Redis({
      sentinels: config.redis.sentinels,
      name: config.redis.name,
      password: config.redis.password,
      keyPrefix: ns,
    })
  } else {
    redis = new Redis({
      port: config.redis.port,
      host: config.redis.url,
      family: 4,
      password: config.redis.password,
      keyPrefix: ns,
    })
  }

  redis.on('error', err => {
    isReady = false
    console.log(err)
  })

  redis.on('ready', () => {
    if (!isReady) {
      console.log('redisCache connection succeed')
      isReady = true
    }
  })
}

function setValue(key, value, expire) {
  redis.set(key, value)
  if (expire) {
    redis.expire(key, expire)
  }
}

function getValue(key) {
  return new Promise(resolve => {
    redis.get(key, (err, value) => {
      if (err) {
        console.log(err)
      }
      resolve(value)
    })
  })
}

function setFields(key, fields, expire) {
  redis.hmset(key, fields)
  if (expire) {
    redis.expire(key, expire)
  }
}

function getFields(key) {
  return new Promise(resolve => {
    redis.hgetall(key, (err, fields) => {
      if (err) {
        console.log(err)
      }
      resolve(fields)
    })
  })
}
function setObject(key, object, expire) {
  let value = JSON.stringify(object)
  redis.set(key, value)
  if (expire) {
    redis.expire(key, expire)
  }
}

function getObject(key) {
  return new Promise(resolve => {
    redis.get(key, (err, object) => {
      if (err) {
        console.log(err)
      }
      const value = JSON.parse(object)
      resolve(value)
    })
  })
}

function del(key) {
  return new Promise(resolve => {
    redis.del(key, (err, fields) => {
      if (err) {
        console.log(err)
      }
      resolve(fields)
    })
  })
}

function getRedis() {
  return redis
}

module.exports = {
  getRedis,
  init,
  setValue,
  getValue,
  setFields,
  getFields,
  setObject,
  getObject,
  del,
}
