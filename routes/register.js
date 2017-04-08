var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

router.use(function(req, res, next){
	if(req.session.user != undefined){
		res.redirect('/')
	}
	next();
})

router.get('/', function(req, res){
	res.render('register');
});
router.post('/', function(req,res,next){
	var userdata = req.body.user;
	
	//validate email is correct
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(userdata.email)) res.render('register', {error: 'Invalid email address.'});

	//validate password
	if(userdata.password.length < 8 || userdata.password.length > 25) res.render('register', {error: 'Password must be 8-25 characters long.'});
	if(userdata.password != userdata.passwordre) res.render('register', {error: "Passwords don't match."});
	
	userdata.passhash = bcrypt.hashSync(userdata.password, 10);
	userdata.password = undefined;
	userdata.passwordre = undefined;

	//check that user with same email doesnt exist
	req.dm.User.findOne({email: userdata.email}, function(err, user){
		if(err) return next(err);
		if(user) return res.render('register', {error: 'Email address already in use'});
		
		var newuser = new req.dm.User(userdata);
		newuser.save(function(err){
			if(err) return next(err);
			res.render('registersuccess');
		});
	});
});

//export this router to use in our index.js
module.exports = router;