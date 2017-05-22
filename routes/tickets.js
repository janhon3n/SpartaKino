var express = require('express');
var router = express.Router();
var helperFunctions = require('../helper_functions.js');


router.get('/screening/:id([0-9a-f]{24})/tickets', function(req, res, next){
	req.dm.Screening.findOne({_id: req.params.id})
	  .populate([{path: 'movie'}, {path: 'hall', populate: {path: 'theater'}}])
	  .exec(function(err, screening){
		if(err) return next(err);
		req.dm.Resorvation.find({screening: screening._id}, "_id type", function(err, resorvations){
			if(err) return next(err);
			var availableCount = helperFunctions.countAvailableResorvations(resorvations, screening);
			res.render("tickets", {user: req.session.user, screening: screening, available: availableCount});
		});
	});
});

router.post('/screening/:id([0-9a-f]{24})/seats', function(req, res, next){
	var tickets = req.body.tickets;
	if(!tickets.normal) tickets.normal = 0;
	if(!tickets.wheelchair) tickets.wheelchair = 0;
	req.dm.Screening.findOne({_id: req.params.id})
	  .populate([{path: 'movie'}, {path: 'hall'}])
	  .exec(function(err, screening){
		if(err) return next(err);
		req.dm.Resorvation.find({screening: screening._id}, "_id type", function(err, resorvations){
			if(err) return next(err);
			var availableCount = helperFunctions.countAvailableResorvations(resorvations, screening);
		
			if(!tickets || (tickets.normal < 1 && tickets.wheelchair < 1) || tickets.normal > availableCount.normal || tickets.wheelchair > availableCount.wheelchair){
				res.render("tickets", {user: req.session.user, screening: screening, movie: screening.movie});		
			}

			res.render("seats", {user: req.session.user, screening: screening, movie: screening.movie, hall: screening.hall, tickets: req.body.tickets});			
		});
	});
});

router.post('/screening/:id([0-9a-f]{24})/confirm', function(req, res, next){
	var tickets = req.body.tickets;
	if(!tickets.normal) tickets.normal = 0;
	if(!tickets.wheelchair) tickets.wheelchair = 0;
	var seats = req.body.picked;
	if(!seats.normal) req.body.picked.normal = [];
	if(!seats.wheelchair) req.body.picked.wheelchair = [];
	req.dm.Screening.findOne({_id: req.params.id})
	  .populate([{path: 'movie'}, {path: 'hall', populate: {path: 'theater'}}])
	  .exec(function(err, screening){
		if(err) return next(err);
		req.dm.Resorvation.find({screening: screening._id}, "_id type", function(err, resorvations){
			if(err) return next(err);
			var availableCount = helperFunctions.countAvailableResorvations(resorvations, screening);	
			if(!tickets || (tickets.normal < 1 && tickets.wheelchair < 1) || tickets.normal > availableCount.normal || tickets.wheelchair > availableCount.wheelchair){
				return res.render("tickets", {user: req.session.user, screening: screening, movie: movie});		
			}
			if(tickets.normal != seats.normal.length || tickets.wheelchair != seats.wheelchair.length){
				return res.render("seats",  {user: req.session.user, screening: screening, movie: movie, hall: hall, tickets: req.body.tickets});
			} 
			res.render("confirm", {user: req.session.user, screening: screening, movie: screening.movie, theater: screening.hall.theater, hall: screening.hall, seats: seats});		
		});
	});
});

router.post('/screening/:id([0-9a-f]{24})/finish', function(req,res,next){
	var seats = req.body.seats;
	if(!seats) return next(new Error("Error with seats"));
	var error;
	seats.forEach(function(s){
		var res = {};
		res.screening = req.params.id;
		res.row = s.row;
		res.col = s.col;
		res.type = s.type;
		res.user = req.session.user._id;
		console.log(res);
		req.dm.Resorvation.find({screening: res.screening, row: res.row, col: res.col}, "_id", function(err, resorvations){
			if(!err){
				if(resorvations.length == 0){
					var resorvation = new req.dm.Resorvation(res);
					resorvation.save(function(err){
						console.log("New resorvation saved");
					});
				}
			}
		});
	});
	if(error) return next(error);
	res.redirect("/user");
});

//export this router to use in our index.js
module.exports = router;