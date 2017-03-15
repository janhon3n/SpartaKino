var express = require('express');
var router = express.Router();
var dataManager = require('../../data_manager.js');

router.use(function(req,res,next){
	dataManager.loadMovies(function(err, movies){
		if(err){
			console.log("Error fetching movies");
			next(err);
		} else {
			req.movies = movies;
			console.log(req.movies);
			next();
		}
	});	
});

router.get('/', function(req, res){
	res.json(req.movies);
})

router.get('/amount/:fromi([0-9]{1,3})/:amount([0-9]{1,3})', function(req,res){
	var movis = req.movies.slice(Number(req.params.fromi), Number(req.params.fromi) + Number(req.params.amount))
	res.json(movis);
});

router.get('/search/:title', function(req,res){
	var movies = req.movies.filter(function(m){
		if(m.title.toLowerCase().includes(req.params.title.toLowerCase())
			|| req.params.title === "*"){
			return true;
		}
	});
	res.json(movies);
});

router.get('/id/:id([0-9])', function(req,res){
	var movie = req.movies.filter(function(m){
		if(m.id == req.params.id)
			return true;
	});
	if(movie.length != 1){
		res.json({error:"Error fetching movies"})
	} else {
		res.json(movie[0]);
	}
})

//export this router to use in our index.js
module.exports = router;