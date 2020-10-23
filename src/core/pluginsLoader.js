const plugins = require('@root/smart').plugins
console.log('plugins:', plugins)

const loader = {}
loader.init = function (app) {
  for (let i = 0; i < plugins.length; i++) {
    const item = plugins[i]
    if (item.hasOwnProperty('enable') && item.enable === false) continue

    require(item.src)(app, item.options)
  }
}

module.exports = loader
