# 后端Docker构建部署

后端是基于java的springboot项目，并且使用maven进行项目构建。

打包出来的文件是jar包

```bash
mvn clean package
```

该命令会清理项目之前的构建结果，并重新打包项目。

构建完成后，在项目的target目录下会生成一个 JAR 包，例如your-project-1.0.0.jar。

## 远程构建

类似于前端docker远程构建，在`docker hub`中搜索openjdk。

选择对应的jdk版本，pull拉取到本地镜像当中启动生成容器。

但是在实际使用的情况下，容器运行一会就会自动停止。

![animate.gif](https://s2.loli.net/2025/04/11/5R7CteKojnEwgqU.gif)

在网上找了很多的处理方法都没有效果，换jdk版本也是一样的情况。

最后只能放弃该方式。

## 本地构建

使用`Dockerfile`文件本地构建后端JDK镜像。


```dockerfile
# 使用 OpenJDK 21 作为基础镜像，该镜像包含 JDK 21 环境
# 该镜像适用于需要编译或运行基于 JDK 21 的 Java 应用程序
 
FROM openjdk:21-jdk-slim
 
# 设置容器中的工作目录为 /app
# 所有后续操作（如文件复制、命令执行等）都会基于该目录进行
 
WORKDIR /app
 
# 将本地的 JAR 文件 复制到容器的 /app 目录下
# COPY 命令将指定路径的文件从构建上下文复制到镜像中的目标路径
 
COPY backend-java.jar /app/backend-java.jar
COPY application.yml /app/application.yml

 
# 设置环境变量 JAR_FILE，指向 JAR 文件的名称
# 环境变量可以在容器运行时被应用程序或其他脚本访问
# 这里设置环境变量方便在 Dockerfile 中或运行时引用 JAR 文件
 
ENV JAR_FILE=backend-java.jar
 
# 暴露容器的 8080 端口，使得主机能够与容器的指定端口进行通信
# 通常用于 Web 服务或应用程序监听端口
# 可以根据应用需要更改为其他端口号
 
EXPOSE 8080

 
# 定义容器启动时的默认命令，使用 ENTRYPOINT 设置为 java -jar 来启动应用
# 这行命令会在容器启动时运行 Java 应用，加载指定的 JAR 文件
# 如果没有其他命令传入，ENTRYPOINT 将执行默认的 java -jar jar包名称
 
ENTRYPOINT ["java", "-jar", "./backend-java.jar", "--spring.config.location=application.yml"]
```

构建后端Docker镜像：

```bash
docker build -t backend-image:latest .
```

在终端中执行以下命令启动后端容器：

```bash
docker run -d -p 8080:8080 backend-image:latest
```

## 其他配置

目前只是将后端jar包构建成docker镜像，数据库与redis并没有一起构建。

如果后端容器想要访问宿主机的数据库和redis，有两种方式。

### 更改容器网络模式

在终端使用该命令运行后端容器。

```bash
docker run --net=host myBackendImage
```
`--net=host`：

这是 docker run 命令的一个参数，用于指定容器的网络模式。

当使用 --net=host 时，容器会直接使用宿主机的网络栈，即容器和宿主机共享网络命名空间，容器内的应用程序可以直接通过宿主机的网络接口进行通信。

使用 --net=host 后，容器不再需要进行端口映射，因为它直接使用宿主机的网络。

例如，若容器内的应用监听 8080 端口，那么在宿主机上可以直接通过 localhost:8080 访问该应用。

`安全性`：

使用 --net=host 会使容器直接暴露在宿主机的网络环境中，增加了安全风险。

因为容器内的应用可以直接访问宿主机的网络接口和服务，若容器被攻击，攻击者可能会利用这一点进一步攻击宿主机。

`端口冲突`：

由于容器和宿主机共享网络命名空间，需要确保容器内应用监听的端口在宿主机上没有被其他程序占用，否则会导致端口冲突，应用无法正常启动。


### 更改后端配置

更改后端的application.yml里的数据库（mysql）网络地址与redis网络地址。

注意：

不是直接将数据库和redis的网络地址ip改成宿主机ip

而是使用`host.docker.internal`

```yml
#mysql其他配置...
url: jdbc:mysql://host.docker.internal:3306/

#redis其他配置...
host: host.docker.internal
```

重新构建后端jar镜像再生成容器，容器就能正常访问宿主机的数据库与redis了。





