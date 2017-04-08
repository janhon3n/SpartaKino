var express = require('express');
var router = express.Router();
var dataManager = require('../../data_manager.js');


router.get('/theater/:theater_id([0-9a-f]{24})/hall/:hall_id([0-9a-f]{24})', function(req, res, next){
	req.dm.Theater.findOne({_id : req.params.theater_id}).select(halls).exec(function(err, theater){
		var hall = theater.halls.filter(function(h){
			if(h._id == hall_id) return true;
			return false;
		});
		if(hall.lenght != 1) return next(new Error('Hall not found'));
		res.json(hall[0]);
	});
});

//TODO
router.post('/delete/id/:id([0-9a-f]{24})', function(req,res){
	req.dm.Theater.remove({_id : req.params.id}, function(err){
		if(err) return next(err);
		console.log('User ' + req.session.user.username + ' deleted theater ' + req.params.id);
		res.json({msg : 'Theater deleted successfully'})
	});
});

//export this router to use in our index.js
module.exports = router;