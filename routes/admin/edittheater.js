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
		if(!theater) return next(err);
		res.render('edittheater', {user: req.session.user, theater: theater})		
	});
});
router.post('/', function (req, res) {
	res.redirect('/admin');
});

router.post('/:id([0-9a-f]{24})', function (req, res, next) {
	res.redirect('/admin');
});

//export this router to use in our index.js
module.exports = router;