const glob = require('glob')
const path = require('path')
const dir = path.join(__dirname, '../extends')

const loader = {}
loader.init = function() {
  const files = glob.sync(dir + '/*.js')

  for (const file of files) {
    const name = path.basename(file, '.js')
    const p = require(`../extends/${name}`)

    if (typeof p.init === 'function') {
      p.init()
    }
  }
}

module.exports = loader
