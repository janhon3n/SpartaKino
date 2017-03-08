var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
	if(req.session.user == undefined){
		res.redirect('/')
	}
	next();
})

router.get('/', function(req, res){
	res.render('user', {user: req.session.user});
});
//export this router to use in our index.js
module.exports = router;