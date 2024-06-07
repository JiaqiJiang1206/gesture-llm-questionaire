var express = require('express');
var router = express.Router();
const {addUser} = require('../models/user');

/* GET users listing. */
router.get('/user', function(req, res, next) {
  // if (req.query.name) {
  //   const name = req.query.name;
  //   addUser(name);
  //   res.send('Login success');
  // }
  res.send('Login success');
});


module.exports = router;
