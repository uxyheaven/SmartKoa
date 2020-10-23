const middlewares = require('@root/smart').middlewares
console.log('middlewares:', middlewares)

const loader = {}
loader.init = function (app) {
  for (let i = 0; i < middlewares.length; i++) {
    const item = middlewares[i]
    if (item.hasOwnProperty('enable') && item.enable === false) continue

    if (item.src) {
      app.use(require(item.src)(item.options))
      continue
    }
  }
}

module.exports = loader
