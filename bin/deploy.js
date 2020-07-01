// 部署脚本
// 此脚本会将当前项目根目录的文件(排除node_modules, logs, tests后)
// 部署到远程服务器上的指定目录

const path = require('path')
const NodeSSH = require('node-ssh')
const ssh = new NodeSSH()
const { URL } = require('url')

const program = require('commander')
program
  .version('0.1.0')
  .option('-u, --url [value]', 'http://username:password@host:22/path')
  .option('-l, --locolPath [value]', 'local folder path, default root: ../')
  .parse(process.argv)

const url = new URL(program.url)
// console.log(url);

const server = {
  username: url.username,
  password: url.password,
  host: url.hostname,
  port: url.port,
  // 服务器设置了用键盘输入密码, 所以这里得这样.
  tryKeyboard: true,
}
const ignoreFolders = ['node_modules', 'logs', 'tests']

ssh.connect(server).then(() => {
  const failed = []
  const successful = []
  const localPath = path.join(
    __dirname,
    '../',
    program.locolPath ? program.locolPath : '',
  )

  ssh
    .putDirectory(localPath, url.pathname, {
      recursive: true,
      concurrency: 1,
      validate: itemPath => {
        const baseName = path.basename(itemPath)
        return (
          baseName.substr(0, 1) !== '.' &&
          ignoreFolders.indexOf(baseName) === -1
        )
      },
      tick: (localPath, remotePath, error) => {
        if (error) {
          failed.push(localPath)
        } else {
          successful.push(localPath)
        }
      },
    })
    .then(status => {
      console.log(
        `successful transfers:${
          successful.length
        }\nfailed transfers:${failed.join('\n')}`,
      )

      const packageName = require('../package.json')
      const str = `source /etc/profile;pm2 restart ${packageName.name}`
      ssh.execCommand(str).then(function(result) {
        console.log(`STDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}\n`)
        process.exit(0)
      })
    })
    .catch(error => {
      console.log(error)
      process.exit(0)
    })
})
