# 前端视频流

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


## RTSP前端浏览器播放




