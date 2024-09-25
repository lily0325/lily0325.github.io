# SSE
## 介绍
Server-Sent Events（SSE）是一种允许服务器向客户端推送事件的技术。服务器可以发送数据，而无需客户端发送请求。SSE的主要应用场景是实时更新，如新闻、天气、股票信息等。
### 优点
●实时性：客户端无需频繁发起请求，服务器可主动推送数据，降低服务器压力。
●减少网络流量：与WebSocket相比，SSE传输的数据量更小。
●兼容性：SSE在主流浏览器（如Chrome、Firefox、Safari）中都有很好的支持。
### SSE的语法
SSE使用基于HTTP的服务器推送事件。服务器通过设置Content-Type响应头为text/event-stream来标识它发送的是SSE数据。
### SSE的数据格式主要包括以下三部分：
●数据格式：数据以换行符分隔，每行包含一个事件名称（data）或事件名称与数据（data:）的键值对。
●流控制：使用retry和event行来控制重连和订阅特定事件。
●事件命名：使用event:行来订阅特定事件。每个事件可以有多个订阅者。
### 示例：

data: This is a simple SSE message

data: Another message

retry: 1000

event: my_event

data: This message is for my_event only

## 在JavaScript中使用SSE
在JavaScript中，创建SSE连接需要使用EventSource对象。EventSource对象接收一个URL作为参数，该URL应指向提供SSE数据的服务器端点。
示例：
```javascript
//请求的url记得做代理proxy！！  /api
const eventSource = new EventSource('http://locahost:3001/ssm/getInfo');

//接收数据
eventSource.onmessage = function (event) {
  console.log('Received SSE data:', event.data);
};
//或者
eventSource.addEventListener("msg", function (e) {
    console.log(e);
});

eventSource.onopen = function (event) {
  console.log('SSE connection opened');
};

eventSource.onerror = function (event) {
  console.log('SSE connection error:', event.target.readyState);
  //当后端服务器完成SSE请求，也会触发该函数
  source.close();
};
```

## 在Springboot中使用SSE
如果做了请求拦截，记得放开这个请求路径的拦截
```java
@Controller
@RequestMapping("/sse")
public class SSMController {
    @GetMapping(path = "getInfo", produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public SseEmitter conversation() throws IOException {
        SseEmitter sseEmitter = new SseEmitter(30000L);
        // 新建一个线程
        new Thread(() -> {
            try {
                for (int i = 0; i < 100; i++) {
                    // 每三秒发送一次信息
                    sseEmitter.send(SseEmitter.event().name("msg").data("后端发送消息：" + i));
                    Thread.sleep(3000);
                }
                // 完成发送
                sseEmitter.onCompletion(() -> System.out.println("完成！！！"));// close connection
            } catch (IOException | InterruptedException e) {
                sseEmitter.completeWithError(e); // error finish
            }
        }).start();
        return sseEmitter;
    }
}
 ```

## http轮询请求 websocket请求 和 sse请求对服务器的带宽压力
HTTP轮询（Long Polling）、WebSocket和Server-Sent Events (SSE)这三种实时通信方式对服务器带宽压力的影响各有不同，主要取决于它们的数据传输机制和连接状态。

### HTTP轮询（Long Polling）:

在长轮询中，客户端发起一个HTTP请求到服务器，服务器在没有新数据的情况下会保持这个连接打开，直到有新数据产生或者超时。一旦有新数据，服务器会立即响应并关闭连接，客户端收到响应后再次发起新的请求，形成循环。
这种机制下，每次请求和响应都会占用一定的带宽，尤其是在高频率的轮询下，即使没有新数据，也会产生不必要的带宽消耗。
长轮询在没有新数据时保持连接开放，可以减少服务器的连接建立和关闭开销，但在数据频繁更新的场景下，连续的请求和响应会增加带宽压力。
### WebSocket:

WebSocket是一种在单个TCP连接上进行全双工通信的协议。它通过HTTP升级为WebSocket连接，之后所有的数据交换都在这个持久连接上完成。
由于WebSocket保持了一个持久的连接，所以它在数据传输上的效率更高，减少了连接建立和断开的开销，从而降低了带宽压力。
WebSocket适合于需要持续双向通信的应用场景，如在线聊天、实时游戏等，它能更有效地利用带宽资源。
### Server-Sent Events (SSE):

SSE允许服务器向客户端推送数据，而不需要客户端发送请求。它使用HTTP协议，但只支持单向通信，即服务器到客户端。
在SSE中，客户端发起一个HTTP GET请求，服务器响应后保持连接开放，当有新事件发生时，服务器将数据编码为文本格式并通过HTTP流式传输给客户端。
SSE相比长轮询减少了不必要的请求和响应，因为它只在有新数据时才发送数据，因此在数据更新不频繁的场景下，SSE对服务器带宽的压力较小。
总结来说，WebSocket因为其持久连接和全双工通信特性，在大多数情况下对服务器带宽压力最小；SSE适用于服务器主动推送少量数据的场景，带宽压力适中；而HTTP长轮询在数据频繁更新且网络延迟较高的情况下，可能会导致较大的带宽压力。选择哪种技术应根据具体应用需求和网络环境来决定。
