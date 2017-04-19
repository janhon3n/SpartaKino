var express = require('express');
var router = express.Router();
var dataManager = require('../../data_manager.js');

router.get('/', function(req,res,next){
	req.dm.Theater.find(function(err, theaters){
		if(err) return res.json({error: 'Error fetching theaters'});
		res.json(theaters);
	});
});

router.get('/id/:id([0-9a-f]{24})', function(req, res, next){
	req.dm.Theater.findOne({_id : req.params.id}, function(err, theater){
		if(err) return res.json({error: 'Error fetcing theater'});
		if(!theater) return res.json({error: 'Theater not found'});
		res.json(theater);
	});
});


router.post('/id/:id([0-9a-f]{24})', function(req, res, next){
	req.dm.Theater.update({_id: req.params.id}, req.body.theater, function(err){
		if(err){
			console.log(err);
			res.json({error: 'Updating theater failed'});
			return;
		}
		res.json({msg: 'Theater updated successfully'});
	});
});

router.post('/', function(req, res, next){
	var theater = new req.dm.Theater(req.body.theater);
	theater.save(function(err){
		if(err){
			console.log(err);
			res.json({error: 'Adding theater failed'});
			return;
		}
		res.json({msg: 'Theater added successfully', _id: theater._id});
	});
});



router.post('/delete/id/:id([0-9a-f]{24})', function(req,res){
	req.dm.Theater.remove({_id : req.params.id}, function(err){
		if(err) return res.json({error: 'Error deleting theater'});
		console.log('User ' + req.session.user.username + ' deleted theater ' + req.params.id);
		res.json({msg : 'Theater deleted successfully'})
	});
});

//export this router to use in our index.js
module.exports = router;