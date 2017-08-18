var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/login_view', { layout: 'layouts/login_layout' });
});

module.exports = router;
