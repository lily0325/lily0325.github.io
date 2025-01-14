# 前端视频流

## HLS前端浏览器播放

### 常用前端浏览器播放器

1. HTML5 原生播放器：HTML5 原生播放器是浏览器自带的播放器，支持 HLS 协议的播放。

2. 第三方播放器：除了浏览器自带的播放器外，还有一些第三方播放器可以支持 HLS 协议的播放，如 JW Player、Video.js、xg Player、Vue3-video-play、easyPlayer、hls.js 等。

但是很多时候HLS直播链接不是这些第三方播放器都可以播放，需要自己一个一个使用这些第三方播放器demo测试是否可以播放。

### 使用h265web.js库播放HLS视频流

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


## RTSP前端浏览器播放

前端浏览器正常来说是无法直接播放RTSP视频流的，需要使用FFmpeg等工具将RTSP视频流转换成其他能够在前端播放的视频流格式，所以是没有纯前端的处理方法，除非是使用第三方的浏览器播放插件来使用。

可以将RTSP视频流通过FFmpeg转成rtmp，但是rtmp视频流基于flash才能播放，所以你的电脑必须安装flash，但是当前各大浏览器都准备不再支持flash，而且rtmp视频流播放还是具有2-3秒的延迟实现，所以不推荐使用。

主流的浏览器播放RTSP视频流的方式：

1. `使用FFmpeg和WebSocket`：

    FFmpeg是一个强大的多媒体处理工具，可以将RTSP流转换为其他格式。

    可以使用FFmpeg将RTSP流转换为MEPG-TS或DASH格式，然后通过WebSocket将转换后的流发送到浏览器。

    浏览器端需要使用相应的播放器库来播放，例如JSMPEG。

2. `使用FFmpeg和WebRTC`：

    WebRTC是一种实时通信技术，它允许浏览器之间进行实时音频、视频和数据传输。

    可以使用WebRTC将RTSP流转换为浏览器可播放的格式，如VP8或VP9。

    需要在服务器端进行转码和代理，将RTSP流转换为WebRTC流。


### 使用FFmpeg和WebSocket

#### 首先先下载FFMPEG

官方地址：https://ffmpeg.org/

不是安装包类型的，根据系统下载源码后，将其放到环境变量中，使其能够全局调用。

#### RTSP视频流转换成WebSocket

使用的是github开源的项目

https://github.com/xiaosen125/video

掘金地址：

https://juejin.cn/post/6844903949309313037?searchId=20240816191001FD5B207680FC9CA96B7D#heading-7

使用FFMPEG本地主码流转码的方式转换成mpeg-ts格式，前端通过websocket方式接收二进制流并在canvas中展示画面

复刻项目：https://gitee.com/lily0325/rtsp2web



#### 核心调用：

在项目的routes文件夹中的video.js文件中，`/play`地址的post请求接收前端传回来的用户ID与设备Code，通过这两个参数，获取到该设备真正的RTSP视频流地址。

开启一个子进程，将RTSP视频流通过FFMPEG转成mpeg-ts格式，然后通过websocket发送出去。

```JS
router.post('/play', async (req, res, next) => {
  const { clientID, cameraID } = req.body;
  try {
    await updateRecord(clientID);
    // 通过clientID和cameraID获取到设备的RTSP视频流地址
    // ···
      playStatic = await videoStream(rtspUrl, clientID, cameraID);
      playStatic.startTransCodo();

    res.status(200).send({ cameraID });
  } catch (error) {
    res.status(500).send({ error: '内部服务器错误' + error });
  }
});

```

上述代码中的VideoStream类是一个封装好的类，其中的startTransCodo方法就是新建一个Mpeg1Muxer类的实例

这个Mpeg1Muxer类能够开启一个子进程，调用FFMPEG将RTSP视频流转换成mpeg-ts格式流，然后通过websocket发送出去，前端通过websocket接收到视频每一帧的二进制流，然后使用JSMPEG库在canvas中展示画面。

```JS
// 生成唯一ID
const clientID = uuid.v4();


// 播放实时视频
const transCodeApi = (data) => {
  fetch("/rtspUrl/live/VnetPlay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      // 获取 id 为 video 的元素
      const videoElement = document.getElementById("video");
      // 创建一个新的 canvas 元素
      const canvas = document.createElement("canvas");
      canvas.id = "video-canvas";
      canvas.width = videoElement.clientWidth;
      // 清空 videoElement 原有的子元素，并添加新的 canvas 元素
      videoElement.innerHTML = "";
      videoElement.appendChild(canvas);

      const url = `ws://localhost:8080/videoService/clientID=${clientID}&cameraID=${data.cameraCode}`;
      // const canvas_doc = document.getElementById("video-canvas");
      player = new JSMpeg.Player(url, {
        canvas: canvas,
        videoBufferSize: 1024 * 1024 * 100,
        pauseWhenHidden: false, //  标签页处于非活动状态时是否暂停播放
        onPlay: function () {
          console.log("onPlay");
        },
        onEnded: function () {
          console.log("onEnded");
        },
      });
    })
    .catch((err) => {
      autolog.log("设备直播流请求失败！", "error", 2500);
    });
};


// 调用
await transCodeApi({ clientID, cameraCode: val });
```