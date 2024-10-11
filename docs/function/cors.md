# 跨域问题处理

因为浏览器自带的同源策略导致不同域之间的资源交互被限制，只有跨域才能让不同域之间进行交互。（服务器之间是没有跨域问题的）

## 实现跨域方法

1. 开发环境采用`vite`(proxy)或者`webpack`(devServer)的代理。

2. 采用`nginx`的location代理跨域请求。

3. 通过后端服务器添加HTTP响应头`Access-Control-Allow-Origin`指定哪些源可以访问其资源。(CORS)

4. 通过`websocket`方式实现跨域通信，WebSocket协议本身不受同源策略限制，但需要服务器支持WebSocket协议。

5. 采用`SSE`通信方式，SSE允许服务器推送数据到客户端，不受同源策略限制，但只支持单向通信。

6. 通过`JSONP`，绕过同源策略限制，只适用于GET请求。

## Vite和Webpack在开发环境的代理

在开发环境中，Vite 和 Webpack 都提供了代理功能，用于解决跨域问题，使得前端应用能够访问后端API。

### Vite 的代理配置

Vite 使用 vite.config.js 文件中的 server.proxy 属性来配置代理。

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://backend.example.com', // 目标服务器地址
        changeOrigin: true, // 是否改变请求的origin
        rewrite: path => path.replace(/^\/api/, '') // 重写路径，移除前缀
      }
    }
  }
}
```

在这个例子中，所有以 /api 开头的请求都会被代理到 http://backend.example.com，并且会自动改变请求的 origin。

### Webpack 的代理配置

Webpack 使用 webpack-dev-server 提供的代理功能。你需要在 webpack.config.js 或单独的 dev-server.js 文件中配置代理规则。

```javascript
// webpack.config.js 或 dev-server.js
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://backend.example.com',
        secure: false, // 如果目标服务器使用HTTPS，设置为true
        changeOrigin: true,
        pathRewrite: { '^/api': '' } // 重写路径
      }
    }
  }
});
```

在这个例子中，所有以 /api 开头的请求会被代理到 http://backend.example.com，并且会改变请求的 origin。

### 注意事项

1. 确保代理配置中的 target 地址正确无误。

2. changeOrigin 设置为 true 是为了允许跨域请求。

3. pathRewrite 用于重写请求路径，移除代理前缀，确保后端API能够正确解析请求。

通过上述配置，你可以在开发环境中轻松解决跨域问题，无需在后端API上进行额外的CORS配置。






## JSONP

JSONP（JSON with Padding）是一种跨域数据交互的技术，它利用了`<script>`标签的特性，即`<script>`标签可以加载来自任意域名的资源。这种特性使得JSONP能够绕过同源策略的限制，实现跨域请求。

JSONP是<u>前后端互相配合</u>才能达成的

JSONP的工作流程如下：

1. 客户端构造一个函数：客户端首先定义一个函数，这个函数将用来处理服务器返回的数据。

2. 构建请求URL：在请求URL中，会包含一个回调函数名作为参数，这个函数名就是步骤1中定义的函数名。

3. 动态插入`<script>`标签：客户端通过动态插入`<script>`标签来发起请求，src属性设置为请求的URL。

4. 服务器响应：服务器接收到请求后，会将数据包装在一个函数调用中返回，这个函数名就是请求中传递的回调函数名。

5. 执行回调函数：当`<script>`标签加载完成后，浏览器会执行其中的JavaScript代码，也就是执行那个回调函数，从而处理服务器返回的数据。

例如，客户端可能有如下代码：
```javascript
function handleResponse(data) {
  console.log('Received data:', data);
}

// 构建请求URL
var script = document.createElement('script');
script.src = 'http://example.com/data?callback=handleResponse';
document.head.appendChild(script);
```

而服务器端则会返回类似这样的内容：
```
handleResponse({"key": "value"});
```
这样，即使http://example.com与当前页面不在同一个域下，也能够成功获取并处理数据。需要注意的是，JSONP只支持GET请求方式。
