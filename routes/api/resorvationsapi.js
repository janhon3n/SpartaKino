var express = require('express');
var router = express.Router();

router.post('/delete/id/:id([0-9a-f]{24})', function(req,res,next){
	req.dm.Resorvation.remove({_id: req.params.id}, function(err){
		if(err) return next(err);
		console.log('Resorvation '+req.params.id+' deleted');
		res.json({msg: 'Resorvation deleted successfully'})
	});
});
router.get('/screening/:screening_id([0-9a-f]{24})', function(req,res,next){
	req.dm.Resorvation.find({screening: req.params.screening_id}, function(err, resorvations){
		if(err) return next(err);
		res.json(resorvations);
	});
});

router.get('/screening/:screening_id([0-9a-f]{24})/amount', function(req,res,next){
	req.dm.Resorvation.find({screening: req.params.screening_id})
	  .exec(function(err, resorvations){
		if(err) return next(err);
		req.dm.Screening.findOne({_id: req.params.screening_id})
		  .populate('hall')
		  .exec(function(err, screening){
			if(err) return next(err);
			var amount = {}
			amount.normal = {}
			amount.wheelchair = {}
			amount.normal.max = screening.hall.seats;
			amount.wheelchair.max = screening.hall.wheelchair_seats;
			amount.normal.reserved = 0;
			amount.wheelchair.reserved = 0;
			
			for(var i = 0; i < resorvations.length; i++){
				if(resorvations[i].type == "normal"){
					amount.normal.reserved++;
				} else if(resorvations[i].type == "wheelchair"){
					amount.wheelchair.reserved++;
				}
			}
		res.json(amount);
		});
	});
});
//export this router to use in our index.js
module.exports = router;