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
router.post('/', function(req, res){
	var username = req.body.username;
	console.log(username + " is trying to log in");
	var password = req.body.password;
	console.log(bcrypt.hashSync(password, 10));
	
	dataManager.loadUsers(function(err, users) {
		console.log(users);
		if(err){
			console.log(err);
			res.render("login", {error: err.message});
		} else {
			var user = users.filter(function(u){
				if(u.username === username && bcrypt.compareSync(password, u.passhash)){
					return true;
				}
			});
			
			if(user.length != 1){
				res.render("login", {error: "Incorrect username or password"});
			} else {
				console.log(username + " logged in successfully");
				req.session.user = user[0];
				req.session.user.passhash = null;
				res.redirect('/');
			}
		}
	});	
})
//export this router to use in our index.js
module.exports = router;