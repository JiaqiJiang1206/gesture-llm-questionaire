var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();


const cors = require('cors');

app.use(cors());
// 允许所有跨域请求
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

// 设置 Mongoose 连接
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoDB = 'mongodb://localhost:27017';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise; // 使用 Node 自带的 Promise
const db = mongoose.connection; // 连接
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../Vue/dist')));  // 设置静态文件目录

// 路由：将路由文件添加进中间件链
const dataRouter = require("./routes/data.js");
const usersRouter = require('./routes/users');
const submitRouter = require('./routes/submit.js');
const bodyDataRouter = require('./routes/bodyData.js');

app.use("/", dataRouter.router);
app.use("/", usersRouter);
app.use("/", submitRouter);
app.use('/', bodyDataRouter);
// app.use('/catalog', catalogRouter); // 将 catalog 路由添加进中间件链

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
