var express = require('express');
var router = express.Router();
var fs = require('fs');
var dataManager = require('../data_manager.js');


router.get('/', function(req, res){
	//show list of movies page
	res.render('movies', {user: req.session.user});
});

router.use('/movie/:id([0-9]{1,5})', function(req,res,next){
	movs = req.movies.filter(function(m){
		if(m.id == req.params.id)
			return true;
	});
	if(movs.length != 1){
		var err = new Error("Movie not found");
		next(err)
	} else {
		var movie = movs[0];
		for(var i = 0; i < movie.screenings.length; i++){
			var thea = req.theaters.filter(function(t){
				if(t.id == movie.screenings[i].theater){
					return true;
				}
			});
			movie.screenings[i].theater = thea[0];
		}
		req.movie = movie;
		console.log(movie);
		next();
	}
});
router.get('/movie/:id([0-9]{1,5})', function(req,res){
		res.render("movie", {user: req.session.user, movie: req.movie});
});
router.get('/movie/:id([0-9]{1,5})/tickets', function(req, res){
	res.render("tickets", {user: req.session.user, movie: req.movie});
});

//export this router to use in our index.js
module.exports = router;