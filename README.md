# KoaWheel

## WebIDE

https://uxyheaven.cloudstudio.net/ws/yqeihv

## 模块说明

### Controller

负责解析用户的输入, 处理后返回相应的结果, 例如

- 在 API 接口中, Controller 接受用户的参数, 调用 Service/Models 查找内容返回给用户或者将用户的请求更新到数据库中.
- 在 HTML 页面请求中, Controller 根据用户访问不同的 URL, 渲染不同的模板得到 HTML 返回给用户.
- 在代理服务器中, Controller 将用户的请求转发到其他服务器上, 并将其他服务器的处理结果返回给用户.

框架推荐 Controller 层主要对用户的请求参数进行处理（校验、转换）, 然后调用对应的 Service 方法处理业务, 得到业务结果后封装并返回：

- 获取用户通过 HTTP 传递过来的请求参数.

- 校验、组装参数.
- 调用 Service 进行业务处理, 必要时处理转换 Service 的返回结果, 让它适应用户的需求.
- 通过 HTTP 将结果响应给用户.

### Service

在复杂业务场景下用于做业务逻辑封装的一个抽象层, 提供这个抽象有以下几个好处：

- 保持 Controller 中的逻辑更加简洁.
- 保持业务逻辑的独立性, 抽象出来的 Service 可以被多个 Controller 重复调用.
- 将逻辑和展现分离, 更容易编写测试用例, ~~测试用例的编写具体可以查看这里~~.

使用场景

- 复杂数据的处理, 比如要展现的信息需要从数据库获取, 还要经过一定的规则计算, 才能返回用户显示.或者计算完成后, 更新到数据库
- 第三方服务的调用, 比如 GitHub 信息获取等

### Models

模型

### Middlewares

中间件

## Scripts

```
[NODE_ENV=(环境名))] npm run (脚本名) [-- (应用参数)]

环境: development(缩写 dev), sit, production(缩写 prod)
默认是 development 环境

example:
sit环境下运行 start
NODE_ENV=sit npm run start

npm run start // 直接启动应用
npm run debug // 使用 nodemon 启动应用, 此时会监听文件的变化, 一旦发现文件有改动, Nodemon 会自动重启应用. 一般用于开发环境
npm run stop // 杀死node进程

npm run pm2 // 使用 pm2 启动应用, 当应用死掉时, pm2 会自动重启应用. 一般用于生产环境
本项目的 pm2 采用的是 ecosystem.config 配置方式调用 pm2, 因此设置环境需要用其指定的方式,
npm run pm2 [-- --env 环境名]
pm2 kill // 停止pm2
example:
生产环境下使用 pm2 启动应用
npm run pm2 -- --env prod

npm run resetDB // 使用 sequelize 扫描目录(/src/models), 在数据库中创建对映的表. 该操作会清除所有数据.

npm run test // 调用目录(test)中的测试代码

npm run deploy // 部署到特定服务器
example:
npm run deploy -- -u http://username:password@host:22/path
```

## Docker

Docker 是一个开源的应用容器引擎, 让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中, 然后发布到任何流行的 Linux 或 Windows 机器上, 也可以实现虚拟化. 在本项目中 docker 起两个作用.

- 将自身制作镜像
- 运行一些外部依赖, 如 mysql, redis, 详情见 docker.md.

```
# 将自身制作镜像
docker build -t koademo:1.0 .
```
