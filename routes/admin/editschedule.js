var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');

// Screening schedule editing
router.get('/theater/:theater_id([0-9a-f]{24})',function(req,res){
	res.redirect('/admin/editschedule/theater/'+req.params.theater_id+'/week/0');
});
router.get('/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})',function(req,res){
	res.redirect('/admin/editschedule/theater/'+req.params.theater_id+'/hall/'+req.params.hall_id+'/week/0');
});

router.get('/theater/:theater_id([0-9a-f]{24})/week/:week([0-9])', function (req, res, next) {
	req.dm.Hall.findOne({theater: req.params.theater_id}, function(err, hall){
		if(err) return next(err);
		res.redirect('/admin/editschedule/theater/'+req.params.theater_id+'/hall/'+hall._id+'/week/'+req.params.week);
	});
});

router.get('/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})/week/:week([0-9])', function(req,res,next){
	req.dm.Theater.findOne({_id: req.params.theater_id}, function(err,theater){
		if(err) return next(err);
		req.dm.Hall.find({theater: req.params.theater_id}, "name _id", function(err, halls){
			if(err) return next(err);
			var hall;
			for(var i = 0; i < halls.length; i++){
				if(halls[i]._id.equals(req.params.hall_id)){
					hall = halls[i];
					break;
				}
			}
			var nextweek = Number(req.params.week) + 1;
			var prevweek = Number(req.params.week) - 1;
			res.render("editschedule", { user: req.session.user, theater: theater, hall: hall, halls: halls, week: req.params.week, nextweek: nextweek, prevweek: prevweek});
		});
	});
});



//screening editing
router.get('/editscreening/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})/:id([0-9a-f]{24})', function(req,res,next){
	req.dm.Screening.findOne({_id: req.params.id}, function(err,screening){
		if(err) return next(err);
		req.dm.Movie.find().select('title _id').exec(function(err, movies){
			if(err) return next(err);
			res.render('editscreening', {user:req.session.user, screening: screening, movies:movies});
		})
	});
});
router.get('/editscreening/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})', function(req,res,next){
	req.dm.Theater.findOne({_id: req.params.theater_id}, function(err,theater){
		if(err) return next(err);
		req.dm.Hall.findOne({_id : req.params.hall_id}, function(err, hall){
			if(err) return next(err);
			req.dm.Movie.find().select('title _id').exec(function(err, movies){
				if(err) return next(err);
				res.render("editscreening", { user: req.session.user, theater: theater, hall: hall, movies: movies});
			})
		});
	});
});
router.post('/editscreening/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})/:id([0-9a-f]{24})', function(req,res,next){
	//update screening
	var screening = req.body.screening;
	screening.datetime = new Date(screening.date + " " + screening.time);
	screening.hall = req.params.hall_id;
	req.dm.Screening.update({_id: req.params.id}, screening, function(err){
		if(err) return next(err);
		res.redirect('/admin/editschedule/theater/'+req.params.theater_id+'/hall/'+req.params.hall_id);
	});
});
router.post('/editscreening/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})', function(req,res,next){
	var weeks = 1;
	if(req.body.showtimes.radio == "multiple")
		weeks = Number(req.body.showtimes.weeks);
	var screening = req.body.screening;
	screening.hall = req.params.hall_id;
	console.log(screening);
	
	//create screenings
	for(var i = 1; i <= weeks; i++){
		var date = moment(screening.date).add((i-1) * 7, 'days');
		var screeni = JSON.parse(JSON.stringify(screening));
		screeni.datetime = new moment(date.format("YYYY-MM-DD") + " " + screening.time, "YYYY-MM-DD HH:mm");
		var screeningSave = new req.dm.Screening(screeni);
		screeningSave.save(function(err){
			console.log(err);
		});
	}
	res.redirect('/admin/editschedule/theater/'+req.params.theater_id+'/hall/'+req.params.hall_id);
});

//export this router to use in our index.js
module.exports = router;