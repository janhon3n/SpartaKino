var express = require('express');
var router = express.Router();
var fs = require('fs');

// Theater editing
router.get('/', function (req, res) {
	res.render("edittheater", { user: req.session.user });
});

router.get('/:id([0-9a-f]{24})', function (req, res, next) {
	req.dm.Theater.findOne({_id : req.params.id}, function(err, theater){
		if(err) return next(err);
		res.render('edittheater', {user: req.session.user, theater: theater})		
	});
});
router.post('/', function (req, res) {
	var theater = new req.dm.Theater(req.body.theater);
	theater.save(function(err){
		if(err) return next(err);
		console.log("Theater " + theater.name + " added by " + req.session.user.username);
		res.redirect('/admin');
	});
});

router.post('/:id([0-9a-f]{24})', function (req, res) {
	req.dm.Theater.update({_id : req.params.id}, req.body.theater, function(err){
		if(err) return next(err);
		console.log("Theater " + req.body.theater.name + " edited by " + req.session.user.username);
		res.redirect('/admin');
	});
});

//export this router to use in our index.js
module.exports = router;