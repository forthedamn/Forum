var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var URL = require('url');
var querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res) {
  Post.get(null,function(err,posts){
    if(err){
      posts = []; 
    };
  res.render('index', { 
      title: 'Forum首页',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
      });
   });
});

/******注册*******/
router.get('/reg',checkNotLogin);
router.get('/reg',function(req,res){
	res.render('reg', {
		title: '注册',
		sussecc: req.flash('sussecc').toString(),
		error: req.flash('error').toString(),
    usedname: req.flash('usedname').toString()
	});
});

router.post('/reg',function(req,res){
	var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
  //检验用户两次输入的密码是否一致
  //生成密码的散列值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: req.body.name,
      password: password,
  });
  //检查用户名是否已经存在 
  User.get(newUser.name, function(err, user){
    if(user){
      err = '用户已存在!';
      udn = newUser.name;
    }
    if(err){
      req.flash('error', err);
      req.flash('usedname', udn);
      return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save(function(err){
      if(err){
        req.flash('error',err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;//用户信息存入session
      req.flash('success','注册成功!');
      res.redirect('/');
    });
  });
});

/******登录*******/
router.get('/login',checkNotLogin);
router.get('/login',function(req,res){
	res.render('login', {title: '登录',
    error:req.flash('error').toString()
  });
});
router.post('/login',function(req,res){
  //生成密码的散列值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function(err, user){
    if(!user){
      req.flash('error', '用户不存在!'); 
      return res.redirect('/login'); 
    }
    //检查密码是否一致
    if(user.password != password){
      req.flash('error', '密码错误!'); 
      return res.redirect('/login');
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success','登陆成功!');
    res.redirect('/');
  });
});

/******登出*******/
router.get('/logout',checkLogin);
router.get('/logout',function(req,res){
  req.session.user=null;
   req.flash('success','登出成功!');
  return res.redirect('/');
});

/******发帖*******/
router.get('/write',checkLogin);
router.get('/write',function(req,res){
  res.render('write',{title:'发帖'})
});
router.post('/write',function(req,res){
  var currentUser = req.session.user,
    post = new Post(currentUser.name,req.body.title,req.body.post);
    post.save(function(err){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      req.flash('success','发布成功！');
      res.redirect('/');
    });
});

/**查看帖子**/
router.get('/article',checkLogin);
router.get('/article',function(req,res){
  var arg = URL.parse(req.url).query;   //取出锚点a中href的值
  var id = querystring.parse(arg).id;
  Post.get(id,function(err,posts){
    if(err){
      posts = [];
    };
    res.render('article', {
      title: 'forum',
      posts: posts,
    });
  });
 
});
function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录！');
    return res.redirect('/');
  }
  next();
}
function checkLogin(req,res,next){
  if(!req.session.user){
    req.flash('error','未登录，请先登录！');
    return res.redirect('/login');
  }
  next();
}
module.exports = router;