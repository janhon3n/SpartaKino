var express = require('express');
var router = express.Router();
var fs = require('fs');
var dataManager = require('../data_manager.js');
var multer = require('multer')
var jimp = require('jimp')

var upload = multer({ dest: '/uploads/' })

router.use(function(req, res, next){
	if(req.session.user == undefined || req.session.user.type !== "admin"){
		res.redirect('/')
	}
	next();
})

router.use('/', function(req,res,next){
	dataManager.loadMovies(function(err, movies){
		if(err){
			console.log("Error fetching movies");
			next(err);
		} else {
			req.movies = movies;
			next();
		}
	});	
});

router.get('/', function(req, res){
	res.render('admin', {user: req.session.user, movies: req.movies});
});

router.get('/editmovie', function(req,res){
	res.render('editmovie', {user: req.session.user});
});
router.get('/editmovie/:id([0-9]{1,5})', function(req,res){
	var movie = req.movies.filter(function(m){
		if(m.id == req.params.id)
			return true;
	});
	if(movie.length != 1){
		res.render('error', {error:"Error fetching movies"})
	} else {
		res.render('editmovie', {user: req.session.user, movie: movie[0]});
	}
});
router.post('/editmovie', function(req,res){
	var movie = req.body.movie;
	console.log(req.body.cropper);
	if(req.body.cropper.filename != undefined){
		var filename = req.body.cropper.filename;
		while(fs.existsSync("./public/img/movies/o_"+filename)
			|| fs.existsSync("./public/img/movies/b_"+filename)
			|| fs.existsSync("./public/img/movies/s_"+filename)) {
		
			filename = "_"+filename;
		}
		console.log(filename);
		//image saved at /public/img/upload, crop it and save
		jimp.read("./public/img/upload/"+req.body.cropper.filename, function(err, img){
			if(err){
				console.log(err);
			} else {
				img.write("./public/img/movies/o_"+filename)
					.crop(Number(req.body.cropper.x),Number(req.body.cropper.y),
						Number(req.body.cropper.width), Number(req.body.cropper.height))
					.resize(91*13, 134*13)
					.write("./public/img/movies/b_"+filename)
					.resize(91*5, 134*5)
					.write("./public/img/movies/s_"+filename)					
			}
		});
		movie.imagefile = filename;
	} else {
		movie.imagefile = "default.jpg";
	}
	
	dataManager.editMovie(movie, function(err){
		if(err){
			res.render("error", {user: req.session.user, error: err.getMessage()});
		} else {
			res.redirect('/admin');	
		}
	});
});

router.post('/editmovie/:id([0-9]{1,5})', function(req,res){
	req.body.movie.id = req.params.id;
	dataManager.editMovie(req.body.movie);
	res.redirect('/admin');
});

router.post('/editmovie/imageupload', upload.single('img'), function(req,res){
	if(req.file != undefined){
		var tmp_path = req.file.path;
		var filename = req.file.originalname;
		var target_path = './public/img/upload/';
		
		while (fs.existsSync(target_path + filename)) {
			filename = "_" + filename;
		}
		
		// copy the uploaded file
		var src = fs.createReadStream(tmp_path);
		var dest = fs.createWriteStream(target_path + filename, { mode: 0x777 });
		src.pipe(dest);
		src.on('end', function() {
			res.json({success:1, path: "/public/img/upload/"+filename, filename: filename, msg: "File uploaded successfully"});
		});
		src.on('error', function(err) {
			res.json({success:0, msg: "Error uploading file"});
		});
	} else {
		res.json({success:0, msg: "Error uploading file"});
	}
});


router.use('/theater/:theater_id([0-9]{1,5})', function(req,res,next){
	fs.readFile('./data/theaters.json', 'utf8', function (err, data) {
		if(err){
			next(err);
		} else {
			theaters = JSON.parse(data).theaters;
			theaters = theaters.filter(function(t){
				if(t.id == req.params.theater_id)
					return true;
			});
			if(theaters.length != 1){
				var er = new Error("Theater not found");
				next(er);
			} else {
				req.theater = theaters[0];
				next();
			}
		}
	});
});
router.get('/theater/:theater([0-9]{1,5})/edithall/:hall([0-9]{1,5})', function(req,res){
		res.render("edithall", {user: req.session.user, theater: req.theater, hall: req.params.hall});
});
router.get('/theater/:theater([0-9]{1,5})/edithall/:hall([0-9]{1,5})/editor', function(req,res){
	res.render("editor", {user: req.session.user, theater: req.theater, hall: req.params.hall});
});

//export this router to use in our index.js
module.exports = router;