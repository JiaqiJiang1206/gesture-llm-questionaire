// 导入模型
const {User} = require('../models/user'); // 虽然不知道为什么，但注意这里一定要加大括号

// post 请求处理函数，用于保存用户数据
exports.saveUserData = async function (req, res, next) {
    // 从请求中获取用户数据
    const userData = req.body;
    // 使用 User 模型创建新的用户实例
    const newUser = new User(userData);
    // 保存用户数据到数据库
    await newUser.save()
        .then(savedUser => {
            res.status(201).json(savedUser);
        })
        .catch(err => {
            console.log('Error saving user data:', err);
            res.status(500).send('Internal Server Error');
        });
}