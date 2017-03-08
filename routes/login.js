var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var fs = require('fs');

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
	console.log(req.body);
	console.log(username + " is trying to log in");
	var password = req.body.password;
	console.log(bcrypt.hashSync(password, 10));
	
	fs.readFile('./data/users.json', 'utf-8', function(err, data) {
		if(err){
			console.log(err);
			res.render("login", {error: "Server side error"});
		} else {
			
			users = JSON.parse(data).users;
			console.log(users);
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
				res.redirect('/')
			}
		}
	});	
})
//export this router to use in our index.js
module.exports = router;