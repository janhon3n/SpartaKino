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
		req.dm.Resorvation.find({user: user._id})
		  .populate({path: 'screening', populate: [{path: 'movie'}, {path: 'hall', populate: {path: 'theater'}}]})
		  .exec(function(err, resorvations){
			if(err) return next(err);
			res.render('user', {user: user, resorvations: resorvations});
		});
	});
});

//export this router to use in our index.js
module.exports = router;