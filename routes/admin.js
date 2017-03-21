var express = require('express');
var router = express.Router();
var fs = require('fs');
var dataManager = require('../data_manager.js');
var multer = require('multer')
var jimp = require('jimp')

var upload = multer({ dest: '/uploads/' })

/* Middleware to check if user is admin */
router.use(function(req, res, next){
	if(req.session.user == undefined || req.session.user.type !== "admin"){
		res.redirect('/')
	}
	next();
})



router.get('/', dataManager.loadMoviesMW, dataManager.loadUsersMW, dataManager.loadTheatersMW, function(req, res){
	res.render('admin', {user: req.session.user, movies: req.movies, users: req.users, theaters: req.theaters});
});


/* Movie editing form stuff */
router.get('/editmovie', function(req,res){
	res.render('editmovie', {user: req.session.user});
});
router.get('/editmovie/:id([0-9]{1,5})', dataManager.loadMoviesMW, function(req,res){
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

// Post a new movie
router.post('/editmovie', function(req,res){
	var movie = req.body.movie;
	console.log(req.body);
	if(req.body.image.new && req.body.image.new == "true" && req.body.image.filename && req.body.cropper){ // new image sent
		try {
			var filename = req.body.image.filename;
			while(fs.existsSync("./public/img/movies/o_"+filename)
				|| fs.existsSync("./public/img/movies/b_"+filename)
				|| fs.existsSync("./public/img/movies/s_"+filename)) {
				filename = "_" + filename;
			}
			saveNewImage(req.body.image.filename, filename);
			createCroppedImages(req, filename, req.body.cropper);
			movie.imagefile = filename;
			movie.imagecropper = req.body.cropper;
		} catch(err){
			console.log(err);
		}
	}
	console.log(movie);
	
	dataManager.editMovie(movie, function(err){
		if(err){
			res.render("error", {user: req.session.user, error: err.message});
		} else {
			console.log("User "+req.session.user.username+" posted a new movie "+movie.title);
			res.redirect('/admin');
		}
	});
});

// Edit a movie
router.post('/editmovie/:id([0-9]{1,5})', function(req,res){
	var movie = req.body.movie;
	if(req.body.image.filename && req.body.cropper){ // there is a image for this movie
		try{
			var filename = req.body.image.filename;
			if(req.body.image.new && req.body.image.new == "true"){ // image is new
				while(fs.existsSync("./public/img/movies/o_"+filename)
					|| fs.existsSync("./public/img/movies/b_"+filename)
					|| fs.existsSync("./public/img/movies/s_"+filename)) {
					filename = "_" + filename;
				}
				saveNewImage(req.body.image.filename, filename);
			}
			// at this point there is a image at /public/img/movies/o_filename.png
			createCroppedImages(req, filename, req.body.cropper);
			movie.imagefile = filename;
			movie.imagecropper = req.body.cropper;
		} catch(err){
			console.log(err);
		}
	}
	movie.id = Number(req.params.id);
	console.log(movie);
	dataManager.editMovie(movie, function(err){
		if(err){
			console.log(err);
			res.render("error", {user: req.session.user, error: err.message});
		} else {
			console.log("User "+req.session.user.username+" edited the movie "+movie.title);
			res.redirect('/admin');
		}
	});
});


// image posting
router.post('/editmovie/imageupload', upload.single('img'), function(req,res){
	if(req.file != undefined && req.file.mimetype.match("image/*")){
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
			console.log("User "+req.session.user.username+" uploaded file "+filename+" successfully");
			res.json({success:1, path: "/public/img/upload/"+filename, filename: filename, msg: "File uploaded successfully"});
		});
		src.on('error', function(err) {
			console.log("Error uploading file");
			res.json({success:0, msg: "Error uploading file"});
		});
	} else {
		console.log("Error uploading file, file not set or wrong type");
		res.json({success:0, msg: "Error uploading file, file not set or wrong type"});
	}
});



/* Theater editing */
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




/* image moving and modifying functions */
function saveNewImage(filename, newfilename){
	if(!filename) throw new Error("Filename not set");
	if(!fs.existsSync("./public/img/upload/"+filename))	throw new Error("File doesn't exist");
	fs.renameSync("./public/img/upload/"+filename, "./public/img/movies/o_"+newfilename);
}
function createCroppedImages(req, filename, cropdata, callback){
		//image saved at /public/img/movies, crop it and save
		jimp.read("./public/img/movies/o_"+filename, function(err, img){
			if(err){
				console.log(err);
				if(callback) callback(err);
			} else {
				img.crop(Number(req.body.cropper.x),Number(req.body.cropper.y),
						Number(req.body.cropper.width), Number(req.body.cropper.height))
					.resize(91*12, 134*12)
					.write("./public/img/movies/b_"+filename)
					.resize(91*3, 134*3)
					.write("./public/img/movies/s_"+filename)					
				if(callback) callback();
			}
		});
	}

//export this router to use in our index.js
module.exports = router;