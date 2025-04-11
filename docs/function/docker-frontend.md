# 前端Docker构建部署

在现代软件开发中，高效的部署流程对于项目的成功至关重要。Docker 作为一种容器化技术，能够将应用程序及其依赖打包成一个独立的、可移植的容器，极大地简化了部署过程，提高了部署的一致性和可重复性。

## 准备环境

<big>windows系统</big>：

访问 Docker 官方网站（https://www.docker.com/products/docker-desktop）下载 Docker Desktop 安装程序。

默认是装在C盘当中，如果C盘内存不够想要装D盘，就需要命令行启动安装程序exe

```bash
"E:\EdgeDownload\Docker Desktop Installer.exe" install --installation-dir="D:\Program Files\Docker"
```

“E:\EdgeDownload\Docker Desktop Installer.exe”：安装包的完整路径。

install：执行安装操作的命令。

–installation-dir=“D:\Program Files\Docker”：指定新的安装目录。

## 前端构建镜像

前端先打包出来dist文件，还有准备好nginx的配置conf。

### 远程构建

在`Docker Desktop`中进入`Docker Hub`（需要翻墙）。

![image.png](https://s2.loli.net/2025/04/11/qkX4Fz9xoPY52Qc.png)

选择nginx的镜像，并pull拉取到本地docker镜像当中。

![image.png](https://s2.loli.net/2025/04/11/Q4yXmU3GhFOankd.png)

查看docker镜像，就能看到刚刚拉取的镜像。

![image.png](https://s2.loli.net/2025/04/11/38iP1z6tohJWSHT.png)

运行并设置好映射端口生成容器（nginx容器里默认配置是80端口）

运行生成容器之后就相当于一个linux虚拟机，可以在里面上传编辑文件，把打包好的前端文件放到nginx容器里再重新运行nginx就可以在宿主机访问到nginx的服务。


### 本地构建

使用`Dockerfile`文件本地构建前端nginx镜像。

在前端项目的根目录当中创建dockerfile文件（无后缀）

```dockerfile
# 使用官方的Nginx镜像作为基础镜像​
FROM nginx:latest​
​
# 将前端项目打包后的静态文件复制到Nginx的默认HTML目录​
COPY dist/ /usr/share/nginx/html/​
​
# 复制自定义的Nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf​
​
# 暴露Nginx服务的端口​
EXPOSE 80
```

1. 首先指定了基于官方的 Nginx 最新镜像。

2. 然后将前端项目打包后的dist文件夹内容复制到 Nginx 容器的默认 HTML 目录/usr/share/nginx/html/。

3. 如果项目有自定义的 Nginx 配置文件nginx.conf，可以将其复制到容器的/etc/nginx/目录下（上述代码中这一步是注释掉的，可根据实际需求启用）。

4. 最后暴露 Nginx 服务的 80 端口。

在在终端使用命令构建（注意最后有个.）

```bash
docker build -t frontend-image:latest .
```

其中-t参数用于指定镜像的标签。

frontend-image:latest表示镜像名称为frontend-image，标签为latest。

最后的.表示 Dockerfile 所在的上下文路径，即当前目录。

构建完成后就可以在Docker Desktop的镜像中看到，启动镜像生成容器就是一个完整的前端nginx项目。

也可以在终端使用命令启动容器。

```bash
docker run -d -p 80:80 frontend-image:latest
```

这里使用-d参数使容器在后台运行，-p参数将宿主机的 80 端口映射到容器的 80 端口。frontend-image:latest是前端 Docker 镜像。

