var express = require('express');
var router = express.Router();

router.post('/delete/id/:id([0-9a-f]{24})', function(req,res){
	req.dm.Resorvation.remove({_id: req.params.id}, function(err){
		if(err) return next(err);
		console.log('Resorvation '+req.params.id+' deleted');
		res.json({msg: 'Resorvation deleted successfully'})
	});
});

//export this router to use in our index.js
module.exports = router;