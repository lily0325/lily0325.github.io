# 服务器部署前后端+SSL证书

技术层面：前端用nginx，后端用java

## 1.远程链接云服务器

我使用的是finalShell工具，通过SSH连接ip到云服务器。(终端工具只要能够查看上传服务器里的文件就ok)

## 2.前后端打包

### `前端`：


使用命令npm run build进行打包

打包出来的dist文件夹就是压缩好的前端代码

放到nginx里的html文件夹

如果要使用代理，就需要配置nginx.conf

配置好后使用命令启动nginx

/usr/local/nginx/sbin/nginx

### `后端`：
在idea的maven生命周期里选择package打包出jar包

在云服务器里使用命令 

```
    nohup java -jar 文件名.jar 2>&1 & 
```

启动java后端 而且日志都存在nohup.out文件里，不会在命令行那边显示

## 3.开放端口
如果云服务器有安全组，就要在安全组配置里允许80端口和443端口访问（这两个端口需要ICP备案好才能够正常访问）

如果云服务器开了防火墙，就需要防火墙开放端口
```
    firewall-cmd --zone=public --add-port=443/tcp --permanent
```
开放端口后需要重启防火墙才能生效
```
    firewall-cmd --reload
```
这样基本上在公网上就能直接通过ip或者域名来访问前端(也就是nginx的端口)，不过因为没有ssl证书，所以是http非https，如果系统有小程序的话，就一定要部署ssl证书小程序才能访问。

## 4.部署SSL证书

采用免费的SSL证书工具CertBot，证书到期后还能自动免费续期。

![certbot](https://s2.loli.net/2024/10/09/Meh6jUxgCw8qy2T.png)

[官网地址](https://certbot.eff.org/instructions?ws=nginx&os=snap&tab=standard)

使用的是nginx和centos7的版本

跟着官网上面的教程，一步一步安装好Certbot

然后执行命令
```
    sudo certbot certonly --nginx
```
获取到证书，一共有两个文件，一个是公钥一个是私钥

```nginx
server{
    listen 443 ss1;
    server_name ***;
    ssl certificate /etc/letsencrypt/live/www.***/fullchain.pem;
    ssl certificate key /etc/letsencrypt/live/www.***/privkey.pem;
}
```
将这两个文件地址配置到nginx.conf里面，而且在监听端口后面添加ssl。

中间过程可能会报很多错误，根据错误信息在网上找对应解决方式就行。

其中一个错误是nginx没有安装Certbot的插件，安装上后还要启用nginx里面的ssl的插件
然后重启nginx基本上就ok了。

正常访问域名前面加个https能够正常访问前端页面。

### nginx.conf基本配置
```nginx
http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;
    client_max_body_size 200m;
    #gzip  on;
    server {
        listen       80;
        server_name  www.XXX.net XXX.net;
    	   return 301 https://www.XXX.net;
    }

    server {
        listen       443 ssl;
        server_name  XXX.net www.XXX.net; 
	   ssl_certificate	/etc/letsencrypt/live/www.XXX.net/fullchain.pem;
	   ssl_certificate_key	/etc/letsencrypt/live/www.XXX.net/privkey.pem;
        #charset koi8-r;
        location / {
            root   html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html last;
        }
        #  后端代理
        location /api/ {
		proxy_pass http://localhost:3001/;
	   }
	   location /.well-konwn {
		index index.html;
	   }
    }
}
```

### 测试certbot自动更新
```sh
    sudo certbot renew --dry-run
```
如果执行后显示以下文字就说明测试成功了
```sh
Congratulations, all renewals succeeded. The following certs have been renewed:  
   /etc/letsencrypt/live/www.XXXX.com/fullchain.pem (success)
```

### 提醒

测试自动更新时他是需要80端口空出来的，如果当前nginx还占着80端口记得先把nginx关闭，测试完再重新启动nginx。


## 5.重新部署

如果有新的前后端打包文件要重新部署
前端：
①进入nginx文件夹，进入html文件夹
②将html文件夹里的文件删除，然后将新打包的文件上传进去
③进入nginx文件夹的sbin文件夹，输入指令
```
    ./nginx -s reload
```
重启nginx
后端：
①首先先输入命令
```
    ps -ef | grep java
```
 查看java进程

②找到对应jar包的进程id

③输入命令
```
    kill -9 对应进程id
```
杀死后端服务

④将jar包替换成新的，然后输入命令
```
    nohup java -jar 对应jar包名字 2>&1 &
```
重新启动后端

不过后端一般还包括mysql，mysql可以使用sql文件进行导入数据和表

