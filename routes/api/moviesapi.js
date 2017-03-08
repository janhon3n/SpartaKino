var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res){
	fs.readFile('./data/movies.json', 'utf-8', function(err, data) {
		if(err){
			console.log(err);
			res.json({error:"Error fetching movies"})
		} else {
			movies = JSON.parse(data).movies;
			console.log(movies);
			res.json(movies);
		}
	});	
})

router.get('/amount/:from([0-9])/:amount([0-9])', function(req,res){
	fs.readFile('./data/movies.json', 'utf8', function (err, data) {
		if(err){
			console.log(err);
			res.json({error:"Error fetching movies"})
		} else {
			movies = JSON.parse(data).movies;
			movies = movies.slice(req.params.from, req.params.from + req.params.amount)
			res.json(movies);
		}
	});
});

router.get('/search/:name', function(req,res){
	fs.readFile('./data/movies.json', 'utf8', function (err, data) {
		if(err){
			console.log(err);
			res.json({error:"Error fetching movies"})
		} else {
			movies = JSON.parse(data).movies;
			movies = movies.filter(function(m){
				if(m.name.toLowerCase().includes(req.params.name.toLowerCase())
					|| req.params.name === "*"){
					return true;
				}
			});
			res.json(movies);
		}
	});			
});

router.get('/id/:id([0-9])', function(req,res){
	fs.readFile('./data/movies.json', 'utf8', function (err, data) {
		if(err){
			console.log(err);
			res.json({error:"Error fetching movies"})
		} else {
			movies = JSON.parse(data).movies;
			movie = movies.filter(function(m){
				if(m.id == req.params.id)
					return true;
			});
			if(err || movie.length != 1){
				res.json({error:"Error fetching movies"})
			} else {
				res.json(movie[0]);
			}
		}
	});	
})

//export this router to use in our index.js
module.exports = router;