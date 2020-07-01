// 一些测试
const glob = require('glob')
const path = require('path')
const dir = path.join(__dirname, '../../tests')

const loader = {}

loader.test = function () {
  console.log('########## test start ##########')
  const files = glob.sync(dir + '/*.js')

  for (const file of files) {
    const name = path.basename(file, '.js')
    if (name.indexOf('_') === 0) continue

    const test = require(`../../tests/${name}`)
    console.log(`### ${name} start ###`)

    // todo 异步
    for (const key in test) {
      const method = test[key]
      if (typeof method === 'function' && key.indexOf('case_') !== -1) {
        method.apply()
      }
    }

    console.log(`### ${name} end ###`)
  }

  console.log('########## test end ##########')
}

module.exports = loader
