// 一个测试类
const test = {}

// 以case_打头的方法会被加入测试中
test.case_1 = function () {
  console.log(1)
}

module.exports = test
