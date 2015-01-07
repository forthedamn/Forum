var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Forum首页' });
});

router.get('/reg',function(req,res){
	res.render('reg', {title: '注册'})
});

module.exports = router;
