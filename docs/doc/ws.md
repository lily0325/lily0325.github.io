# WebSocket

## 简介

WebSocket是一种网络通信协议，它在单个TCP连接上进行全双工通讯。WebSocket协议于2011年被IETF定为标准RFC 6455，并由RFC7936补充规范。

### 特点
1.双向实时通讯：WebSocket允许服务器主动向客户端推送数据，而不是等待客户端请求。
2.低延迟：WebSocket的通信延迟比HTTP请求/应答模式低得多。
3.长连接：WebSocket连接一旦建立，就可以持续通信，直至一方关闭连接。

### 基本原理

WebSocket通信分为三个阶段：握手、数据交换和关闭连接。
1.握手：客户端通过HTTP请求向服务器发起WebSocket连接请求，包含特殊的Upgrade头部字段。服务器确认请求后，握手完成。
2.数据交换：握手完成后，客户端和服务器可以通过WebSocket连接发送任意数据。数据被封装成帧，以便于解析和传输。
3.关闭连接：任何一方都可以通过发送特定的帧来关闭WebSocket连接。接收到关闭帧的一方将关闭连接。
### 应用场景
WebSocket广泛应用于实时通信、在线游戏、实时推送等场景。

### 总结

WebSocket协议提供了一种高效、低延迟的双向实时通信机制，适用于需要实时交互的Web应用。了解WebSocket的基本原理和应用场景，可以帮助我们更好地设计和开发实时Web应用。


## Springboot中使用
SpringBoot整合WebSocket的相关依赖

在pom.xml里添加依赖。
```java
<!-- Spring WebSocket -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```
添加WebSocket的配置类在SpringBoot中启用WebSocket
```java
/**
 * 开启WebSocket支持
 */
@Configuration  
public class WebSocketConfig {  
    @Bean  
    public ServerEndpointExporter serverEndpointExporter() {  
        return new ServerEndpointExporter();  
    }
} 
```
WebSokcet工具类记录当前的在线连接对链接进行操作
```java
public class WebsocketUtil {
  /**
   * 记录当前在线的Session
   */
  private static final Map<String, Session> ONLINE_SESSION = new ConcurrentHashMap<>();

  /**
   * 添加session
   * @param userId
   * @param session
   */
  public static void addSession(String userId, Session session){
    // 此处只允许一个用户的session链接。一个用户的多个连接，我们视为无效。
    ONLINE_SESSION.putIfAbsent ( userId, session );
  }

  /**
   * 关闭session
   * @param userId
   */
  public static void removeSession(String userId){
    ONLINE_SESSION.remove ( userId );
  }

  /**
   * 给单个用户推送消息
   * @param session
   * @param message
   */
  public static void sendMessage(Session session, String message){
    if(session == null){
      return;
    }
    // 同步
    RemoteEndpoint.Async async = session.getAsyncRemote ();
    async.sendText ( message );
  }

  /**
   * 向所有在线人发送消息
   * @param message
   */
  public static void sendMessageForAll(String message) {
    //jdk8 新方法
    ONLINE_SESSION.forEach((sessionId, session) -> sendMessage(session, message));
  }
}
 ```
### WebSocket接口处理类
也就是websocket真正请求的地址，userId相当于房间名，根据房间名进入到房间，开始监听房间里的信息。
```java
@Component
@ServerEndpoint(value = "/chat/{userId}")
public class WebsocketController {
    /**
     * 连接事件，加入注解
     * @param userId
     * @param session
     */
    @OnOpen
    public void onOpen(@PathParam(value = "userId") String userId, Session session) {
        String message = "[" + userId + "]加入聊天室！！";
        // 添加到session的映射关系中
        WebsocketUtil.addSession(userId, session);
        // 广播通知，某用户上线了
//        WebsocketUtil.sendMessageForAll(message);
    }

    /**
     * 连接事件，加入注解
     * 用户断开链接
     *
     * @param userId
     * @param session
     */
    @OnClose
    public void onClose(@PathParam(value = "userId") String userId, Session session) {
        String message = "[" + userId + "]退出了聊天室...";
        // 删除映射关系
        WebsocketUtil.removeSession(userId);
        // 广播通知，用户下线了
        WebsocketUtil.sendMessageForAll(message);
    }

    /**
     * 当接收到用户上传的消息
     *
     * @param userId
     * @param session
     */
    @OnMessage
    public void onMessage(@PathParam(value = "userId") String userId, Session session, String message) {
        String msg = "[" + userId + "]:" + message;
        System.out.println("接收到信息：" + msg);
        // 直接广播
        WebsocketUtil.sendMessageForAll(msg);
    }

    /**
     * 处理用户活连接异常
     *
     * @param session
     * @param throwable
     */
    @OnError
    public void onError(Session session, Throwable throwable) {
        try {
            session.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        throwable.printStackTrace();
    }
}
``` 
### 服务器端单个用户推送消息
走正常http方式，请求之后就会把信息发到对应房间id里

扫码就是用这种方式，虽然websocket支持双向通信，用户也可以send信息到服务器里，但是因为扫码用的设备是手机，而展示二维码与监听是否登陆成功的是在网页里，是分开的，所以手机那边需要走http，如果是聊天室那种功能，那直接调用send方法就能够把信息发送给服务器。
```java
@PostMapping("/send")
public void send(@RequestParam("id")  String id,@RequestParam("message")String message) {
    Session session = ONLINE_SESSION.get(id);
    WebsocketUtil.sendMessage(session,message);
    System.out.println("发送成功");
}
```
https://juejin.cn/post/7372591578755940367?searchId=202408290947537954A9E9F373E8C4D0BC

## 前端使用
```javascript
const socket = new WebSocket('ws://localhost:8888/chat/1');
socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
};
//接收后端消息
socket.onmessage = (event) => {
    const data = event.data;
};

socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
};
function sendMessage(message) {
    //发送消息到后端
    socket.send(message);
 }
```

