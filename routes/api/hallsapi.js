var express = require('express');
var router = express.Router();


router.get('/theater/id/:id([0-9a-f]{24})', function(req, res, next){
	req.dm.Hall.find({theater: req.params.id}, function(err, halls){
		if(err) return res.json({error: 'Error fetching halls'});
		res.json(halls);
	});
});

router.get('/id/:id([0-9a-f]{24})', function(req, res, next){
	req.dm.Hall.findOne({_id : req.params.id}, function(err, hall){
		if(err) return next(err);
		if(!hall) return next({error: 'Hall not found'});
		res.json(hall);
	});
});

router.get('/id/:id([0-9a-f]{24})/resorvations/screening/:screening_id([0-9a-f]{24})', function(req,res,next){
	req.dm.Hall.findOne({_id : req.params.id}, function(err, hall){
		if(err) return next(err);
		if(!hall) return next({error: 'Hall not found'});
		req.dm.Screening.findOne({_id: req.params.screening_id}, function(err, screening){
			if(err) return next(err);
			req.dm.Resorvation.find({screening: screening._id}, function(err, resorvations){
				for(var i = 0; i < hall.elements.length; i++){
					for(var u = 0; u < resorvations.length; u++){
						if(hall.elements[i].col == resorvations[u].col && hall.elements[i].row == resorvations[u].row){
							//seat is reserved
							if(hall.elements[i].name == "chair"){
								hall.elements[i].set("reserved", true, {strict:false});
							}
							break;
						}
					}
				}
				res.json(hall);
			});
		});
	});
});

router.post('/', function(req,res,next){
	var hall = new req.dm.Hall(req.body.hall);
	hall.save(function(err){
		if(err){
			console.log(err);
			return res.json({error: 'Failed adding new hall'});
		}
		res.json({msg: 'Hall added successfully'})
	});
});
router.post('/id/:id([0-9a-f]{24})', function(req,res,next){
	req.dm.Hall.update({_id : req.params.id}, req.body.hall, function(err){
		if(err){
			console.log(err);
			return res.json({error: 'Failed updating hall'})
		}
		res.json({msg: 'Hall added successfully'})
	});
});

router.post('/delete/id/:id([0-9a-f]{24})', function(req,res){
	req.dm.Hall.remove({_id : req.params.id}, function(err){
		if(err) return next(err);
		console.log('User ' + req.session.user.username + ' deleted hall ' + req.params.id);
		res.json({msg : 'Hall deleted successfully'})
	});
});

//export this router to use in our index.js
module.exports = router;