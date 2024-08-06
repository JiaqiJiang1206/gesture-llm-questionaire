var express = require('express');
var router = express.Router();
const { addAnswer } = require('../models/answer'); 

router.post("/submit", function(req, res, next) {
  addAnswer(req.body);
  res.send("插入成功！");
  console.log("插入成功！", req.body);
});

// router.get("/submit", function(req, res, next) {
//   res.send("进来啦");
// });

module.exports = router;
