# docker 使用笔记

[toc]

## 安装 docker

https://docs.docker.com/install/

## docker 常用指令

```
docker run IMAGE[:TAG] // 通过run命令创建一个新的容器（container）

docker images // 查看镜像
docker rmi name // 删除镜像

docker stats // 查看容器运行状态, 包括cup, 内存, 网络
docker ps // 查看所有正在运行容器,  -a查看所有容器, -q 查看容器ID

docker start containerId // 运行一个容器
docker stop containerId // 停止容器 containerId 是容器的ID
docker stop $(docker ps -a -q) // stop停止所有容器
docker rm $(docker ps -a -q) // remove删除所有容器
```

docker run 命令详解

```
docker run [OPTIONS] IMAGE[:TAG] [COMMAND] [ARG...]
-a=map[]: 附加标准输入、输出或者错误输出
-c=0: 共享CPU格式（相对重要）
-cidfile="": 将容器的ID标识写入文件
-d=false: 分离模式，在后台运行容器，并且打印出容器ID
-e=[]:设置环境变量
-h="": 容器的主机名称
-i=false: 保持输入流开放即使没有附加输入流
-privileged=false: 给容器扩展的权限
-m="": 内存限制 (格式:<number><optional unit>, unit单位 = b, k, m or g)
-n=true: 允许镜像使用网络
-p=[]: 匹配镜像内的网络端口号
-rm=false:当容器退出时自动删除容器 (不能跟 -d一起使用)
-t=false: 分配一个伪造的终端输入
-u="": 用户名或者ID
-dns=[]: 自定义容器的DNS服务器
-v=[]: 创建一个挂载绑定：[host-dir]:[container-dir]:[rw|ro].如果容器目录丢失，docker会创建一个新的卷
-volumes-from="": 挂载容器所有的卷
-entrypoint="": 覆盖镜像设置默认的入口点
-w="": 工作目录内的容器
-lxc-conf=[]: 添加自定义-lxc-conf="lxc.cgroup.cpuset.cpus = 0,1"
-sig-proxy=true: 代理接收所有进程信号(even in non-tty mode)
-expose=[]: 让你主机没有开放的端口
-link="": 连接到另一个容器(name:alias)
-name="": 分配容器的名称，如果没有指定就会随机生成一个
-P=false: Publish all exposed ports to thehost interfaces 公布所有显示的端口主机接口
```

## 镜像下载

```
docker pull [镜像名称]
```

镜像搜索去[官网](https://hub.docker.com/), 速度慢可以走[阿里云加速器](https://account.aliyun.com/login/login.htm?oauth_callback=https://cr.console.aliyun.com/&lang=zh#/accelerator)

## 常用容器启动

### nginx

```
docker pull nginx

docker run -d --name nginx-a \
-p 8080:8080 \
-v `pwd`/dist:/etc/nginx/html:ro \
nginx
```

```
// 修改默认的nginx配置(需要自己配置nginx.conf文件), 同时支持https(需要自己制作证书)
docker run --name nginx-a \
-p 443:443 \
-p 8080:8080 \
-v `pwd`/dist:/etc/nginx/html:ro \
-v `pwd`/nginx/nginx.conf:/etc/nginx/nginx.conf:rw \
-v `pwd`/nginx/certs:/etc/nginx/certs:ro \
nginx
```

### mysql

```
docker pull mysql

docker run -d --name mysql-a \
-p 3306:3306 \
-v `pwd`/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
mysql:5.7

// 这里用5.7版本, 用8.x的版本连接不上. 初始化的时候需要目录为空
```

### redis

```
docker pull redis

docker run -d --name redis-a \
-p :6379:6379 \
-v `pwd`/redis/data:/data \
redis
```

```
// 打开redis持久化配置
docker run -d --name redis-a \
-p :6379:6379 \
-v `pwd`/redis/data:/data \
redis redis-server --appendonly yes
```

### MongoDB

```
docker pull mongo

docker run -d --name mongo-a \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=123456 \
-v `pwd`/mongo/db:/data/db \
mongo
```

### kafka(待更新)

```
docker pull wurstmeister/zookeeper
docker pull wurstmeister/kafka

docker run -d --name zookeeper \
-p 2181:2181 \
wurstmeister/zookeeper

docker run -d --name kafka --publish 9092:9092 \
--link zookeeper \
-e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
-e KAFKA_ADVERTISED_HOST_NAME=127.0.0.1 \
-e KAFKA_ADVERTISED_PORT=9092 \
wurstmeister/kafka:latest
```

运行 `docker ps`，找到 kafka 的 CONTAINER ID，运行 `docker exec -it ${CONTAINER ID} /bin/bash`，进入 kafka 容器
进入 kafka 默认目录 `/opt/kafka_2.11-0.10.1.0`，运行 `bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic test`，创建一个 topic 名称为 test
运行 `bin/kafka-topics.sh --list --zookeeper zookeeper:2181` 查看当前的 topic 列表
运行一个消息生产者，指定 topic 为刚刚创建的 test ， `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test`，输入一些测试消息

再重新连接下 kafka, 同样的进到默认目录下, 运行一个消息消费者，同样指定 topic 为 test， `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning`，可以接收到生产者发送的消息。

### node

```
docker run -d --name node-a \
-p 3003:3003 \
-v `pwd`:/usr/src/app \
node
```

## 容器互访

使用 --network 命令可以指定容器运行的网络，通过将多个容器指定到同一个网络可以让容器间相互访问。

创建网络

```
docker network create -d bridge net-b
```

指定网络

```
// redis
docker run -d --name redis-b --network net-b redis`

// mysql
docker run -d --name mysql-b  \
-e MYSQL_ROOT_PASSWORD=root --network net-b mysql:5.7`

// api
docker run -d --name api-b --network net-b -p 3000:3000 your-image
```

不过需要注意这时候就没有连接的别名了, 在容器里面, `host` 直接使用对方容器的 `name` 访问即可。

## docker 如何知道容器里的参数

docker run 命令执行的时候，需要传入参数，有时候不知道参数是什么。
比如 activemq

```
docker run --name activemq -d \
-v /data/activemq/log:/var/log \
-p 61616:61616 \
webcenter/activemq
```

如何知道 activemq 里的 volumn 是 /data/activemq, 又如何知道它有哪些端口

可以先执行`docker run --name myactivemq webcenter/activemq`, 启动一个默认的容器, 然后执行`docker inspect myactivemq` 就可以从 Config 节点获取到, 如下:

```
"Config": {
	// ...
	"ExposedPorts": {
		"1883/tcp": {},
		"5672/tcp": {},
		"61613/tcp": {},
		"61614/tcp": {},
		"61616/tcp": {},
		"8161/tcp": {}
	},
	// ...
	"Env": [
		"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
		"ACTIVEMQ_CONFIG_DIR=/opt/activemq/conf.tmp",
		"ACTIVEMQ_DATA_DIR=/data/activemq"
	],
	// ...
}
```

## 使用 docker-compose

```
编排
version: '3.1'

services:
mongo:
image: mongo # 镜像name
restart: always # 默认值为 no ，即在任何情况下都不会重新启动容器；当值为 always 时，容器总是重新启动；当值为 on-failure 时，当出现 on-failure 报错容器退出时，容器重新启动。
ports:
- 27017:27017
environment: # 环境变量
MONGO_INITDB_ROOT_USERNAME: root
MONGO_INITDB_ROOT_PASSWORD: example
mongo-express:
image: mongo-express
restart: always
ports:
- 8081:8081
environment:
ME_CONFIG_MONGODB_ADMINUSERNAME: root
ME_CONFIG_MONGODB_ADMINPASSWORD: example

运行
docker-compose up
```

## 名词解释

- 镜像 / image
  Docker 镜像是容器应用打包的标准格式，在部署容器化应用时可以指定镜像，镜像可以来自于 Docker Hub，阿里云容器 Hub，或者用户的私有 Registry。镜像 ID 可以由镜像所在仓库 URI 和镜像 Tag（缺省为 latest）唯一确认。

- 容器 / container
  一个通过 Docker 镜像创建的运行时实例，一个节点可运行多个容器。

- 集群
  一个集群指容器运行所需要的云资源组合，关联了若干服务器节点、负载均衡、专有网络等云资源。

- 节点 / node
  节点是在群集模式(swarm mode)下运行 Docker 引擎实例的物理或虚拟机。管理器节点执行集群管理和编制任务。默认情况下，管理器节点也是工作节点。

- 编排模板 / Compose
  编排模板包含了一组容器服务的定义和其相互关联，可以用于多容器应用的部署和管理。容器服务支持 Docker Compose 模板规范并有所扩展。

## 参考

- [node 部署实战](http://i5ting.github.io/node-deploy-practice/)
