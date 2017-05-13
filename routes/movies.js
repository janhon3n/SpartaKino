var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function(req, res){
	//show list of movies page
	res.render('movies', {user: req.session.user});
});

router.get('/movie/:id([0-9a-f]{24})', function(req,res,next){
	req.dm.Movie.findOne({_id: req.params.id}, function(err, movie){
		if(err) return next(err);
		req.dm.Theater.find({}, 'name _id', function(err, theaters){
			if(err) return next(err);
			res.render("movie", {user: req.session.user, movie: movie, theaters: theaters});
		});
	});
});

//export this router to use in our index.js
module.exports = router;