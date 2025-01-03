# 视频流

## HLS、FLV、RTMP、RTSP 
<details>
    <summary>HLS、FLV、RTMP、RTSP 的优劣势及延迟情况对比：</summary>

### HLS

#### 优势：

`兼容性好`：基于 HTTP 协议，能在各种设备和浏览器上播放，包括 iOS、Android、桌面浏览器等，无需安装额外插件。

`自适应码率`：可根据网络状况动态调整视频码率，在网络带宽不稳定的情况下，能自动选择合适的码率来保证视频的流畅播放，提高了用户体验。

`稳定性高`：HTTP 协议本身具有广泛的应用和良好的兼容性，因此 HLS 在不同的网络环境和设备上都能够较为稳定地运行。

`便于 CDN 缓存`：切片式的传输方式使得 CDN 可以更方便地对视频进行缓存和分发，减轻源服务器的负担。

#### 劣势：

`延迟较高`：将直播流分割成多个小的 TS 片段，每个片段的时长通常为几秒到十几秒不等，这种分段式的传输方式导致其延迟相对较高，一般在 10-30 秒左右，对于实时性要求极高的互动直播来说不太理想。

`编码解码复杂`：需要对视频进行切片和编码，增加了服务器的处理负担和编码解码的复杂度。

#### 延迟情况：
一般在 10-30 秒左右。

### FLV

#### 优势：

`文件体积小`：形成的文件极小、加载速度极快，使得网络观看视频文件成为可能，在网络带宽有限的情况下，能够更快地加载和播放视频。

`播放灵活`：FLV 文件可以包含多种编码格式的视频和音频流，便于在 Flash 播放器上流式传输，并且可以不通过本地的微软或者 REAL 播放器播放视频。

`技术成熟`：曾经是 Adobe Flash Player 使用的主要视频格式，相关的技术和工具比较成熟，有较多的播放器和服务器支持。

#### 劣势：

`需要 Flash 插件`：传统的 FLV 视频依赖于 Flash 插件，在一些不支持 Flash 插件的设备和浏览器上无法播放，限制了其使用范围。

`相对封闭`：是一种封闭的格式，只能通过 Flash Player 播放器进行播放和显示，而且其流媒体传输需要使用 RTMP 协议，不如 HLS 和 HTTP-FLV 灵活。

`编码效率相对较低`：与一些新兴的视频编码格式相比，FLV 的编码效率相对较低，在相同的画质下，可能需要更高的码率。

#### 延迟情况：

如果是基于 RTMP 协议传输的 FLV，延迟一般在 2-5 秒左右；如果是基于 HTTP 协议传输的 HTTP-FLV，延迟相对较高，一般在 5-10 秒左右，但比 HLS 低。

### RTMP

#### 优势：

`低延迟`：基于 TCP 协议，通过保持一个持续的 TCP 连接，实现了低延迟的数据传输，适合实时互动和直播场景，一般情况下，其延迟可以控制在 1-3 秒左右，能够让主播和观众之间的互动更加流畅自然。

`稳定性高`：具有成熟的技术架构和完善的错误处理机制，能够在各种网络环境下保持较好的传输稳定性，即使在网络出现波动或丢包的情况下，也能够通过重传等机制来保证数据的完整性和连续性，减少直播卡顿和中断的情况发生。

`支持广泛`：在 Flash 平台和服务器之间传输音频、视频和其他数据，曾经被广泛应用于直播和视频会议等领域，相关的服务器和客户端软件比较丰富。

#### 劣势：

`需要特定服务器和客户端`：需要搭建专用的 RTMP 服务器和使用特定的客户端来进行传输和接收，增加了实现和维护的复杂度。

`容易被劫持`：是一种比较容易被劫持的传输协议，存在一定的安全风险。
不支持浏览器原生播放：在浏览器中需要安装 Flash 插件才能播放，随着 Flash 插件的逐渐淘汰，其在浏览器中的兼容性问题日益突出。

#### 延迟情况：

一般可以控制在 1-3 秒左右。

### RTSP

#### 优势：

`实时性好`：常用于视频聊天、视频监控等对实时性要求较高的场景，能够提供较好的实时传输效果。
可扩展性强：是一个基于文本的协议，以自描述方式增加可选参数更容易，不同的媒体服务器可以根据各自的功能，支持不同的请求集，扩展自己的新参数、方法，甚至定义新版本协议。

`支持多种传输协议`：可使用 TCP 或 UDP 完成数据传输，还可以与 RTP、RTCP 等协议结合使用，根据实际需求选择合适的传输方式。

`控制功能强大`：提供了丰富的控制命令，如播放、暂停、快进、快退等，方便客户端对媒体流进行控制。
#### 劣势：

`实现复杂`：协议本身相对复杂，开发和实现难度较大，需要专业的技术人员进行开发和维护。

`兼容性问题`：在不同的设备和浏览器上的兼容性不如 HLS 好，可能会出现一些播放问题。

`防火墙限制`：由于其使用的端口可能会被防火墙拦截，在一些网络环境中可能需要进行特殊的配置才能正常使用。

#### 延迟情况：

本身不直接控制传输延迟，延迟主要取决于 RTP 和网络条件，一般在 1-5 秒左右，但在网络条件较好的情况下可以实现更低的延迟。

</details>

## HLS前端浏览器播放

### 常用前端浏览器播放器

1. HTML5 原生播放器：HTML5 原生播放器是浏览器自带的播放器，支持 HLS 协议的播放。

2. 第三方播放器：除了浏览器自带的播放器外，还有一些第三方播放器可以支持 HLS 协议的播放，如 JW Player、Video.js、xg Player、Vue3-video-play、easyPlayer、hls.js 等。

但是很多时候HLS直播链接不是这些第三方播放器都可以播放，需要自己一个一个使用这些第三方播放器demo测试是否可以播放。

### h265web.js

比如最近项目有个视联设备摄像头的HLS直播链接使用上面这些第三方播放器都无法播放，最后使用了`h265web.js`这个第三方播放器才可以播放。

github地址:https://github.com/numberwolf/h265web.js

使用方法：(Vue3+Vite项目)

1. 在GitHub里下载对应的`h265web.js`、`index.js`、`missile.js`、`missile.wasm`文件。(下载对应时间的版本，如果有问题，可以去issue看下有没有解决方法)

2. 将这几个文件放置于public文件夹下，并在`index.html`中引入。
    选择的是`20211104`更新的这个版本。
    
    ```html
    <body>
    <div id="app"></div>
    <script src="/missile.js"></script>
    <script src="/h265webjs-v20211104.js"></script>
    <script type="module" src="/src/main.ts"></script>
    </body>
    ```

3. 创建公共utils/player.ts文件
    ```JS
    // 将10以下数字转换成0X字符串
    const durationFormmat = (val) => {
      val = val.toString()
      if (val.length < 2) return '0' + val
      return val
    }

    // 时间格式化成字符串
    const setDurationText = (duration) => {
      if (duration < 0) return 'Player'
      const randDuration = Math.round(duration)
      return (
        durationFormmat(Math.floor(randDuration / 3600)) +
        ':' +
        durationFormmat(Math.floor((randDuration % 3600) / 60)) +
        ':' +
        durationFormmat(Math.floor(randDuration % 60))
      )
    }

    // 创建播放器实例并返回
    export const createPlayerServer = (videoUrl, config) => {
      // @ts-ignore
      return window.new265webjs(videoUrl, config)
    }

    // 加载播放器实例
    export const executePlayerServer = (player, timelineEl) => {
      let mediaInfo = null
      player.onLoadFinish = () => {
        mediaInfo = player.mediaInfo()
        if (mediaInfo.videoType === 'vod') {
          timelineEl.textContent =
            setDurationText(0) +
            '/' +
            setDurationText(mediaInfo.meta.durationMs / 1000)
        }
      }
      player.onPlayTime = (pts) => {
        if (mediaInfo.videoType === 'vod') {
          timelineEl.textContent =
            setDurationText(pts) +
            '/' +
            setDurationText(mediaInfo.meta.durationMs / 1000)
        }
      }
      player.do()
    }

    // 释放播放器实例并清空指针
    export const destoryPlayerServer = (playerInstance) => {
      playerInstance.release()
      playerInstance = null
    }
    ```
4. 在组件中使用

    HTML
    ```HTML
    <div class="player-container" ref="container">
      <div id="glplayer" class="glplayer"></div>
    </div>
    ```

    JS
    ```JS
    import { createPlayerServer, executePlayerServer, destoryPlayerServer } from '@/utils/player'
    const URL = ref("");

    const H265JS_DEFAULT_PLAYER_CONFIG = {
      player: "glplayer",
      width: 1450,
      height: 900,
      token:
        "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5j    b20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9t    ZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVt    YmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1",
      extInfo: {
        moovStartFlag: true,
      },
    };
    const timelineRef = ref(null);
    let playerObject = null;
    const container = ref(null);

    const resolveConfig = (conf) =>
      Object.assign(H265JS_DEFAULT_PLAYER_CONFIG, conf);

    // 初始化播放器
    const initPlayer = () => {
      playerObject = createPlayerServer(URL.value, resolveConfig());
      executePlayerServer(playerObject, timelineRef.value);
      let timer = setInterval(() => {
        resumeHandler();
        if (playerObject.isPlaying()) {
          console.log("播放中");
          isloading_video.value = false;
          isBtnShow.value = true;
          clearInterval(timer);
        }
      }, 500);
    };

    onUnmounted(() => destoryPlayerServer(playerObject));

    const playAction = (action) => {
      // 获取当前播放的视频文件的信息数据
      // let mediaInfo = playerObject.mediaInfo();
      // console.log(mediaInfo);
      if (action === "resume" && !playerObject.isPlaying()) {
        console.log("[执行]: 启动");
        playerObject.play();
        return;
      }
      if (action === "pause" && playerObject.isPlaying()) {
        console.log("[执行]: 暂停");
        playerObject.pause();
        return;
      }
      if (action === "reload") {
        console.log("[执行]: 重启");
        isloading_video.value = true;
        document.querySelector("#glplayer").innerHTML = "";
        playerObject.release();
        playerObject = null;
        initPlayer();
        return;
      }
    };

    const resumeHandler = () => playAction("resume");
    const pauseHandler = () => playAction("pause");
    const reloadHandler = () => playAction("reload");
    ```
    把URL替换成你自己的HLS直播链接即可，记得要做代理，不然的话会有跨域问题。
