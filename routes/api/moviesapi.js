var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	req.dm.Movie.find(function(err, movies){
		if(err){
			console.log(err);
			res.status(500).json({error:'Error, try again later'})
			return;
		}
		res.json(movies);
	});
})

router.get('/amount/:fromi([0-9]{1,3})/:amount([0-9]{1,3})', function(req,res){
	req.dm.Movie.find().limit(req.params.amount).skip(req.params.fromi).exec(function(err,movies){
		if(err){
			console.log(err);
			res.status(500).json({error:'Error, try again later'})
			return;
		}
		res.json(movies)
	});
});

router.get('/search/:title', function(req,res){
	req.dm.Movie.find({title: {"$regex": req.params.title, "$options": "i"}}, function(err, movies){
		if(err){
			console.log(err);
			res.status(500).json({error:'Error, try again later'})
			return;
		}
		res.json(movies);
	});
});

router.get('/id/:id([0-9]{1,5})', function(req,res){
	req.dm.Movie.findOne({id: req.params.id}, function(err, movie){
		if(err){
			console.log(err);
			res.status(500).json({error:'Error, try again later'})
			return;
		}
		if(!movie || movie.length != 1){
			res.status(400).json({error:'Movie not found'})
			return;
		}
		res.json(movie)
	});
});

router.post('/', function(req,res,next){
	var movie = new req.dm.Movie(req.body.movie);
	movie.save(function(err){
		if(err){
			console.log(err);
			req.status(400).json({error: 'Error adding new movie'});
			return;
		}	
		res.json({msg: 'Movie added succesfully', _id : movie._id});
	});
});
router.post('/id/:id[0-9a-f]{24}', function(req,res,next){
	req.dm.Movie.update({_id : req.params.id}, req.body.movie, function(err){
		if(err){
			console.log(err);
			res.status(400).json({error: 'Error editing movie'});
			return
		}
		res.json({msg: 'Movie edited succesfully'});
	});
	
});
router.post('/delete/id/:id([0-9a-f]{24})', function(req,res){
	req.dm.Movie.remove({_id: req.params.id}, function(err){
		if(err){
			console.log(err);
			res.status(400).json({error:'Error, try again later'})
			return;
		}
		console.log('Movie '+req.params.id+' deleted');
		res.json({msg: 'Movie deleted successfully'})
	});
});

//export this router to use in our index.js
module.exports = router;