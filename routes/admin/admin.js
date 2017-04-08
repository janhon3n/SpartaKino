var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Middleware to check if user is admin */
router.use(function (req, res, next) {
	if (req.session.user == undefined || req.session.user.type !== "admin") {
		res.redirect('/')
	}
	next();
})

router.get('/', function (req, res, next) {
	var users;
	var movies;
	var theaters;

	var dataReady = function () {
		if (users && movies && theaters) {
			res.render('admin', {
				user: req.session.user,
				movies: movies,
				users: users,
				theaters: theaters
			});
		}
	}

	req.dm.User.find().limit(50).exec(function (err, users2) {
		if (err)
			return next(err);
		users = users2;
		dataReady();
	});
	req.dm.Movie.find().limit(50).exec(function (err, movies2) {
		if (err)
			return next(err);
		movies = movies2;
		dataReady();
	});
	req.dm.Theater.find().limit(50).exec(function (err, theaters2) {
		if (err)
			return next(err);
		theaters = theaters2;
		dataReady();
	});

});

/*

// Theater editing
router.get('/edittheater', dataManager.loadTheatersMW, function(req,res){
res.render("edittheater", {user: req.session.user, theater: req.theater});
});
router.get('/edittheater/:id([0-9]{1,5})', dataManager.loadTheatersMW, function(req,res){
var theater = req.theaters.filter(function(t){
if(t.id == req.params.id)
return true;
});
if(theater.length != 1){
res.render('error', {error:"Error fetching movies"})
} else {
res.render('edittheater', {user: req.session.user, theater: theater[0]});
}
});
router.post('/edittheater', function(req,res){
theater = req.body.theater;
theater = fixNumbersForTheaters(theater);
theater.id = 0;
dataManager.editTheater(theater, function(err){
if(err){
console.log(err);
res.render("error");
} else {
res.redirect('/admin');
console.log("Theater "+theater.name+" added by "+req.session.user.username);
}
});
});

router.post('/edittheater/:id([0-9]{1,5})', function(req,res){
theater = req.body.theater;
theater = fixNumbersForTheaters(theater);
dataManager.editTheater(theater, function(err){
if(err){
console.log(err);
res.render("error");
} else {
res.redirect('/admin');
console.log("Theater "+theater.name+" edited by "+req.session.user.username);
}
});
});

// Make numbers in string for into real numbers
function fixNumbersForTheaters(theater){
theater.id = Number(theater.id);
if(theater.halls){
theater.halls.forEach(function(h){
h.id = Number(h.id);
h.rows = Number(h.rows);
h.cols = Number(h.cols);
h.seats = Number(h.cols);
if(h.elements){
h.elements.forEach(function(e){
e.row = Number(e.row);
e.col = Number(e.col);
e.rotation = Number(e.rotation);
});
}
});
}
return theater;
}





 */

//export this router to use in our index.js
module.exports = router;