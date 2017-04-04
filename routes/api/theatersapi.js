var express = require('express');
var router = express.Router();
var dataManager = require('../../data_manager.js');


router.get('/theater/:theater_id([0-9]{1,5})/hall/:hall_id([0-9]{1,5})', dataManager.loadTheatersMW, function(req,res){
	var theater = req.theaters.filter(function(t){
		if(t.id == req.params.theater_id) return true;
	});
	if(theater.length != 1){
		res.json({error:"Error fetching the theater"})
	} else {
		var hall = theater[0].halls.filter(function(h){
			if(h.id == req.params.hall_id) return true;
		});
		if(hall.length != 1){
			res.json({error:"Error fetching the hall"})
		} else {
			res.json(hall[0]);			
		}
	}
})
//TODO
router.post('/delete/id/:id([0-9]{1,5})', function(req,res){
	dataManager.deleteMovie(Number(req.params.id), function(err){
		if(err){
			res.json({success: "fail", msg:"Failed to delete movie"});
		} else {
			res.json({success: "success", msg: "Movie deleted"});
		}
	});
});

//export this router to use in our index.js
module.exports = router;