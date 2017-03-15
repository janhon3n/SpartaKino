var express = require('express');
var router = express.Router();
var fs = require('fs');
var dataManager = require('../data_manager.js');

router.use(function(req, res, next){
	if(req.session.user == undefined || req.session.user.type !== "admin"){
		res.redirect('/')
	}
	next();
})

router.use('/', function(req,res,next){
	dataManager.loadMovies(function(err, movies){
		if(err){
			console.log("Error fetching movies");
			next(err);
		} else {
			req.movies = movies;
			next();
		}
	});	
});

router.get('/', function(req, res){
	res.render('admin', {user: req.session.user, movies: req.movies});
});

router.get('/editmovie', function(req,res){
	res.render('editmovie', {user: req.session.user});
});
router.get('/editmovie/:id([0-9]{1,5})', function(req,res){
	var movie = req.movies.filter(function(m){
		if(m.id == req.params.id)
			return true;
	});
	if(movie.length != 1){
		res.render('error', {error:"Error fetching movies"})
	} else {
		res.render('editmovie', {user: req.session.user, movie: movie[0]});
	}
});

router.use('/theater/:theater_id([0-9]{1,5})', function(req,res,next){
	fs.readFile('./data/theaters.json', 'utf8', function (err, data) {
		if(err){
			next(err);
		} else {
			theaters = JSON.parse(data).theaters;
			theaters = theaters.filter(function(t){
				if(t.id == req.params.theater_id)
					return true;
			});
			if(theaters.length != 1){
				var er = new Error("Theater not found");
				next(er);
			} else {
				req.theater = theaters[0];
				next();
			}
		}
	});
});
router.get('/theater/:theater([0-9]{1,5})/edithall/:hall([0-9]{1,5})', function(req,res){
		res.render("edithall", {user: req.session.user, theater: req.theater, hall: req.params.hall});
});
router.get('/theater/:theater([0-9]{1,5})/edithall/:hall([0-9]{1,5})/editor', function(req,res){
	res.render("editor", {user: req.session.user, theater: req.theater, hall: req.params.hall});
});

//export this router to use in our index.js
module.exports = router;