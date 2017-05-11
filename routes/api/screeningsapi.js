var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req,res,next){
	req.dm.Screening.find({}, function(err, screenings){
		if(err) return next(err);
		res.json(screenings);
	});
});
router.get('/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})', function(req, res, next){
	req.dm.Screening.find({hall: req.params.hall_id}, function(err, screenings){
		if(err) return next(err);
		res.json(screenings);
	});
});
router.post('/', function(req,res,next){
	var screening = new req.dm.Screening(req.body.screening);
	screening.save(function(err){
		if(err) return next(err);
		res.json({msg: 'Screening added succesfully', _id : screening._id});
	});
});
router.post('/id/:id[0-9a-f]{24}', function(req,res,next){
	req.dm.Screening.update({_id : req.params.id}, req.body.screening, function(err){
		if(err)	return next(err);
		res.json({msg: 'Screening edited succesfully'});
	});
});
router.post('/delete/id/:id([0-9a-f]{24})', function(req,res){
	req.dm.Screening.remove({_id: req.params.id}, function(err){
		if(err) return next(err);
		console.log('Screening '+req.params.id+' deleted');
		res.json({msg: 'Screening deleted successfully'})
	});
});
router.get('/search/:date/:theater_id([0-9a-f]{24})/:movie_id([0-9a-f]{24})', function(req,res,next){
	var dayStart = moment(req.params.date, "YYYY-MM-DD").hours(0).minutes(0).seconds(0);
	var dayEnd = dayStart.clone().hours(24).minutes(0).seconds(0);
	console.log(dayStart + " " + dayEnd);
	req.dm.Hall.find({theater : req.params.theater_id}, "_id name", function(err, halls){
		if(err) return next(err);
		console.log(halls);
		req.dm.Screening.find({hall: {$in: halls}, movie: req.params.movie_id}, function(err, screenings){
			if(err) return next(err);
			console.log(screenings);
			screenings = screenings.filter(function(s){
				var datetime = moment(s.datetime);
				console.log(dayStart);
				console.log(datetime);
				console.log(dayEnd);
				if(dayStart.isBefore(datetime) && dayEnd.isAfter(datetime)) return true;
				return false;
			});
			for(var i = 0; i < screenings.length; i++){
				var hall = halls.filter(function(h){
					return (h._id.equals(screenings[i].hall));
				});
				screenings[i].set("hallName", hall[0].name, {strict: false});
			}
			console.log(screenings);
			res.json(screenings);
		});
	});
});

//export this router to use in our index.js
module.exports = router;