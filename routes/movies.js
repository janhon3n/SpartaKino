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



router.get('/screening/:id([0-9a-f]{24})/tickets', function(req, res){
	req.dm.Screening.findOne({_id: req.params.id}, function(err, screening){
		if(err) return next(err);
		req.dm.Movie.findOne({_id: screening.movie}, function(err, movie){
			if(err) return next(err);
			res.render("tickets", {user: req.session.user, screening: screening, movie: movie});		
		});
	});
});

router.post('/screening/:id([0-9a-f]{24})/tickets/seats', function(req, res){
	var tickets = req.body.tickets;
	if(!tickets.normal) tickets.normal = 0;
	if(!tickets.wheelchair) tickets.wheelchair = 0;
	req.dm.Screening.findOne({_id: req.params.id}, function(err, screening){
		if(err) return next(err);
		req.dm.Movie.findOne({_id: screening.movie}, function(err, movie){
			if(err) return next(err);
			req.dm.Hall.findOne({_id: screening.hall}, function(err, hall){
				if(err) return next(err);
				if(!tickets || (tickets.normal < 1 && tickets.wheelchair < 1)){
					res.render("tickets", {user: req.session.user, screening: screening, movie: movie});		
				}
				res.render("seats", {user: req.session.user, screening: screening, movie: movie, hall: hall, tickets: req.body.tickets});		
			});
		});
	});
});

//export this router to use in our index.js
module.exports = router;