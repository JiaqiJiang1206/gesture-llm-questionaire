var express = require('express');
var router = express.Router();
const  { findData } = require('../models/data');
const { addAnswer } = require('../models/answer'); 
const fs = require('fs');
let currentText;
let currentID;

router.get("/data", async function(req, res, next) {
  const data = await findData();// 从数据库中获取一条数据
  console.log("找到的那条数据" + data);
  currentText = data.text;
  currentID = data.id;
  // 读取 data.video_path 文件
  const videoPath = "public/videos/" + data.videoname;
  console.log(videoPath);
  fs.readFile(videoPath, (err, videoData) => {
    if(err){
      console.error('Error reading video file', err);
      return;
    }
    base64Data = videoData.toString('base64');
    
    res.send({ text: data.text, video: base64Data, id: data.id });
  });
});


module.exports = { router, currentText, currentID}
