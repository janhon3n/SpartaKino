var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	req.dm.Movie.find(function(err, movies){
		if(err){
			console.log(err);
			res.json({error:'Error, try again later'})
			return;
		}
		res.json(movies);
	});
})

router.get('/amount/:fromi([0-9]{1,3})/:amount([0-9]{1,3})', function(req,res){
	req.dm.Movie.find().limit(req.params.amount).skip(req.params.fromi).exec(function(err,movies){
		if(err){
			console.log(err);
			res.json({error:'Error, try again later'})
			return;
		}
		res.json(movies)
	});
});

router.get('/search/:title', function(req,res){
	req.dm.Movie.find({title: {"$regex": req.params.title, "$options": "i"}}, function(err, movies){
		if(err){
			console.log(err);
			res.json({error:'Error, try again later'})
			return;
		}
		res.json(movies);
	});
});

router.get('/id/:id([0-9]{1,5})', function(req,res){
	req.dm.Movie.findOne({id: req.params.id}, function(err, movie){
		if(err){
			console.log(err);
			res.json({error:'Error, try again later'})
			return;
		}
		if(!movie || movie.length != 1){
			res.json({error:'Movie not found'})
			return;
		}
		res.json(movie)
	});
});

router.post('/delete/id/:id([0-9]{1,5})', function(req,res){
	req.dm.Movie.remove({id: req.params.id}, function(err){
		if(err){
			console.log(err);
			res.json({error:'Error, try again later'})
			return;
		}
		res.json({msg: 'Movie deleted successfully'})
	});
});

//export this router to use in our index.js
module.exports = router;