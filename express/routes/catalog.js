const express = require('express');
const router = express.Router();

// 导入控制器模块
const data_controller = require('../controllers/dataControllers');
const user_controller = require('../controllers/userController');
const answer_controller = require('../controllers/answerController');

//首页路由
router.get('/', data_controller.index);

/// 数据路由 ///
// GET 随机三十条 counts == 0 的数据
router.get("/data", data_controller.get_random_data);

// PUT 更新数据
router.put("/data/update", data_controller.update_data);

/// 用户路由 ///
// POST 创建用户
router.post("/user", user_controller.create_user);

/// 回答路由 ///
// POST 创建回答
router.post("/answer", answer_controller.create_answer);

module.exports = router;
