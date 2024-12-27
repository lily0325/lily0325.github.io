# 前端录音实现

## vue3基础实现

### 需要安装依赖库
```shell
npm install recorder-core
```

### 引入依赖库
```js
//必须引入的核心
import Recorder from "recorder-core";
//引入mp3格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
// import "recorder-core/src/engine/mp3";
// import "recorder-core/src/engine/mp3-engine";
//录制wav格式的用这一句就行
import "recorder-core/src/engine/wav";
//可选的插件支持项，这个是波形可视化插件
import "recorder-core/src/extensions/waveview";
```

### HTML

```html
<div class="recorder-container">
    <div>
      <!-- 按钮 -->
      <button @click="recOpen">打开录音,请求权限</button>
      <button @click="recStart">开始录音</button>
      <button @click="recStop">结束录音</button>
      <button @click="recPlay">本地试听</button>
      <button @click="recDownload">下载</button>
    </div>
    <div style="padding-top: 5px">
      <!-- 波形绘制区域 -->
      <div
        style="
          border: 1px solid #ccc;
          display: inline-block;
          vertical-align: bottom;
        "
      >
        <div style="height: 100px; width: 300px" ref="recwave"></div>
      </div>
    </div>
</div>

```

### SCRIPT

#### 基础变量定义

```js
//录音的波形绘制区域
const recwave = ref(null);
//录音对象
let rec = null;
//音频可视化图形绘制对象
let wave = null;
//录音文件blob对象
let recBlob = null;
```

#### 方法定义



`首先`需要向用户请求录音的权限，一般会在浏览器左上方出现一个弹窗，询问用户是否允许录音，用户可以选择允许或者拒绝。
```js
//打开录音,请求权限
const recOpen = () => {
  //创建录音对象
  rec = Recorder({
    type: "wav", //录音格式，可以换成wav等其他格式
    sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
    bitRate: 16, //录音的比特率，越大音质越好
    onProcess: (
      buffers,
      powerLevel,
      bufferDuration,
      bufferSampleRate,
      newBufferIdx,
      asyncEnd
    ) => {
      //录音实时回调，大约1秒调用12次本回调
      //可实时绘制波形，实时上传（发送）数据
      if (wave)
        wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
    },
  });

  //打开录音，获得权限
  rec.open(
    () => {
      console.log("录音已打开");
      if (recwave.value) {
        //创建音频可视化图形绘制对象
        wave = Recorder.WaveView({ elem: recwave.value });
      }
    },
    (msg, isUserNotAllow) => {
      //用户拒绝了录音权限，或者浏览器不支持录音
      console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
    }
  );
};
```

`然后`开始录音

```js
//开始录音
const recStart = () => {
  if (!rec) {
    console.error("未打开录音");
    return;
  }
  rec.start();
  console.log("已开始录音");
};
```

`最后`结束录音

```js
//结束录音
const recStop = () => {
  if (!rec) {
    console.error("未打开录音");
    return;
  }
  rec.stop(
    (blob, duration) => {
      //blob就是我们要的录音文件对象，可以上传，或者本地播放
      recBlob = blob;
      //简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
      let localUrl = (window.URL || webkitURL).createObjectURL(blob);
      console.log("录音成功", blob, localUrl, "时长:" + duration + "ms");

      //upload(blob);
      //把blob文件上传到服务器

      rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
    },
    (err) => {
      console.error("结束录音出错：" + err);
      rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
    }
  );
};
```

如果要将录音文件上传到服务器，可以使用`FormData`对象来构建一个表单，然后使用`fetch`来发送请求。

```js
const upload = (blob) => {
  //使用FormData用multipart/form-data表单上传文件
  //或者将blob文件用FileReader转成base64纯文本编码，使用普通application/x-www-form-urlencoded表单上传
  const form = new FormData();
  //和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.wav
  form.append("file", blob, "recorder.wav"); 
  //   form.append("key", "value"); //其他参数

  fetch("XXX", {
    method: "POST",
    body: form,
  })
    .then((res) => {
      console.log("上传成功");
    })
    .catch((err) => {
      console.error("上传失败");
    });
};
```

`本地试听`
```js
const recPlay = () => {
  //本地播放录音试听，可以直接用URL把blob转换成本地播放地址，用audio进行播放
  var localUrl = URL.createObjectURL(recBlob);
  var audio = document.createElement("audio");
  audio.controls = true;
  document.body.appendChild(audio);
  audio.src = localUrl;
  audio.play(); //这样就能播放了

  //注意不用了时需要revokeObjectURL，否则霸占内存
  setTimeout(function () {
    URL.revokeObjectURL(audio.src);
  }, 5000);
};
```

`下载`
```js
const recDownload = () => {
  if (!recBlob) {
    console.log("请先录音，然后停止后再下载");
    return;
  }

  const fileName = "recorder-" + Date.now() + ".wav";
  const downA = document.createElement("a");
  downA.href = URL.createObjectURL(recBlob);
  downA.download = fileName;
  downA.style.display = "none";
  document.body.appendChild(downA);
  downA.click();
  // 释放URL对象
  URL.revokeObjectURL(url);
};
```

### 完整代码

```js
<template>
  <div class="recorder-container">
    <div>
      <!-- 按钮 -->
      <button @click="recOpen">打开录音,请求权限</button>
      <button @click="recStart">开始录音</button>
      <button @click="recStop">结束录音</button>
      <button @click="recPlay">本地试听</button>
      <button @click="recDownload">下载</button>
    </div>
    <div style="padding-top: 5px">
      <!-- 波形绘制区域 -->
      <div
        style="
          border: 1px solid #ccc;
          display: inline-block;
          vertical-align: bottom;
        "
      >
        <div style="height: 100px; width: 300px" ref="recwave"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
//必须引入的核心
import Recorder from "recorder-core";
//引入mp3格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
// import "recorder-core/src/engine/mp3";
// import "recorder-core/src/engine/mp3-engine";
//录制wav格式的用这一句就行
import "recorder-core/src/engine/wav";
//可选的插件支持项，这个是波形可视化插件
import "recorder-core/src/extensions/waveview";

const recwave = ref(null);

let rec = null;
let wave = null;
let recBlob = null;
const recOpen = () => {
  //创建录音对象
  rec = Recorder({
    type: "wav", //录音格式，可以换成wav等其他格式
    sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
    bitRate: 16, //录音的比特率，越大音质越好
    onProcess: (
      buffers,
      powerLevel,
      bufferDuration,
      bufferSampleRate,
      newBufferIdx,
      asyncEnd
    ) => {
      //录音实时回调，大约1秒调用12次本回调
      //可实时绘制波形，实时上传（发送）数据
      if (wave)
        wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
    },
  });

  //打开录音，获得权限
  rec.open(
    () => {
      console.log("录音已打开");
      if (recwave.value) {
        //创建音频可视化图形绘制对象
        wave = Recorder.WaveView({ elem: recwave.value });
      }
    },
    (msg, isUserNotAllow) => {
      //用户拒绝了录音权限，或者浏览器不支持录音
      console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
    }
  );
};

const recStart = () => {
  if (!rec) {
    console.error("未打开录音");
    return;
  }
  rec.start();
  console.log("已开始录音");
};

const recStop = () => {
  if (!rec) {
    console.error("未打开录音");
    return;
  }
  rec.stop(
    (blob, duration) => {
      //blob就是我们要的录音文件对象，可以上传，或者本地播放
      recBlob = blob;
      //简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
      let localUrl = (window.URL || webkitURL).createObjectURL(blob);
      console.log("录音成功", blob, localUrl, "时长:" + duration + "ms");

      //upload(blob);
      //把blob文件上传到服务器

      rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
    },
    (err) => {
      console.error("结束录音出错：" + err);
      rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
    }
  );
};

const recPlay = () => {
  //本地播放录音试听，可以直接用URL把blob转换成本地播放地址，用audio进行播放
  var localUrl = URL.createObjectURL(recBlob);
  var audio = document.createElement("audio");
  audio.controls = true;
  document.body.appendChild(audio);
  audio.src = localUrl;
  audio.play(); //这样就能播放了

  //注意不用了时需要revokeObjectURL，否则霸占内存
  setTimeout(function () {
    URL.revokeObjectURL(audio.src);
  }, 5000);
};

const upload = (blob) => {
  //使用FormData用multipart/form-data表单上传文件
  //或者将blob文件用FileReader转成base64纯文本编码，使用普通application/x-www-form-urlencoded表单上传
  const form = new FormData();
  //和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.wav
  form.append("uploaded_file", blob, "recorder.wav"); 
  //   form.append("key", "value"); //其他参数

  fetch("http://10.17.195.204:8501/audio_recognition", {
    method: "POST",
    body: form,
  })
    .then((res) => {
      console.log("上传成功");
    })
    .catch((err) => {
      console.error("上传失败");
    });
};

const recDownload = () => {
  if (!recBlob) {
    console.log("请先录音，然后停止后再下载");
    return;
  }

  const fileName = "recorder-" + Date.now() + ".wav";
  const downA = document.createElement("a");
  downA.href = URL.createObjectURL(recBlob);
  downA.download = fileName;
  downA.style.display = "none";
  document.body.appendChild(downA);
  downA.click();
  // 释放URL对象
  URL.revokeObjectURL(url);
};
</script>
```