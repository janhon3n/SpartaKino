var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
	if(req.session.user == undefined){
		res.redirect('/')
	}
	next();
})

router.get('/', function(req, res, next){
	req.dm.User.findOne({_id : req.session.user._id}, function(err, user){
		if(err) return next(err);
		if(!user || user == null) return next(new Error('User not found'));
		res.render('user', {user: user});
	});
});

//export this router to use in our index.js
module.exports = router;