
## 项目开发过程中需要注意的事情

身体数据是 0.1 秒记录一次，也就是一秒钟有十个数据。

开发版与发布版之间需要注意的修改的地方：

  1. mongoDB 的链接： 在[express/app.js](express/app.js) 中
  2. 请求后端的 URL 链接：在 [vue/src/api/axios.js](vue/src/api/axios.js) 中
## 身体数据

[Google AI for Developers 文档](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js?hl=zh-cn) 中可以查看与我们使用的两个模型相关的资料。一个是 [BlazePose](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js?hl=zh-cn)，一个是 [HandPose](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker?hl=zh-cn)。[ Github: tfjs-mosels ](https://github.com/tensorflow/tfjs-models/tree/master) 中也可以找到一些信息。

我们现在拿到的**身体坐标**是归一化后的数据，他们的大小为 0 到 1 之间，小于 0 或超过 1 的都可以算作无效数据。常规数据如下图所示：

<img src="https://cdn.jsdelivr.net/gh/JiaqiJiang1206/image@main/img/202406181945823.png" style="width: 300px"/>

我们设文件中存储的数据为 $(x,y)$ ，视频的宽度 `width = 1280` ，视频的高度 `height = 720`。将归一化后的数据转为真实的像素值的公式为：

```python
widthPx = x * width
heightPx = y * height
```

