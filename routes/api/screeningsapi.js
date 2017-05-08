var express = require('express');
var router = express.Router();

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

//export this router to use in our index.js
module.exports = router;