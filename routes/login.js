var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var dataManager = require('../data_manager.js');

router.use(function(req, res, next){
	if(req.session.user != undefined){
		res.redirect('/')
	}
	next();
})

router.get('/', function(req, res){
	res.render('login');
})
router.post('/', function(req, res, next){
	var email = req.body.email;
	
	req.dm.User.findOne({email: email}).select({_id: 1, email: 1, type: 1, passhash: 1}).exec(function(err, user){
		if(err) return next(err);
		if(!user) return res.render('login', {msg: 'Wrong username or password'})
		if(!bcrypt.compareSync(req.body.password, user.passhash)) return res.render('login', {msg: 'Wrong username or password'})

		user.passhash = undefined;
		req.session.user = user;
		console.log(user.email + " logged in");
		res.redirect('/');
	});
})
//export this router to use in our index.js
module.exports = router;