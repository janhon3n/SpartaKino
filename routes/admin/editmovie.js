var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var jimp = require('jimp');

var upload = multer({
	dest: '/uploads/'
})



/* Movie editing form stuff */
router.get('/', function (req, res) {
	res.render('editmovie', {
		user: req.session.user
	});
});
router.get('/:id([0-9a-f]{24})', function (req, res, next) {
	req.dm.Movie.findOne({
		_id: req.params.id
	}, function (err, movie) {
		if (err)
			return next(err);
		if (!movie)
			return next(new Error('Movie not found'));
		res.render('editmovie', {
			user: req.session.user,
			movie: movie
		});
	});
});

// Post a new movie
router.post('/', function (req, res, next) {
	var movie = req.body.movie;
	if (req.body.image.new && req.body.image.new == "true" && req.body.image.filename && req.body.cropper) { // new image sent
		try {
			var filename = req.body.image.filename;
			while (fs.existsSync("./public/img/movies/o_" + filename)
				 || fs.existsSync("./public/img/movies/b_" + filename)
				 || fs.existsSync("./public/img/movies/s_" + filename)) {
				filename = "_" + filename;
			}
			movie.imagefile = filename;
			movie.imagecropper = req.body.cropper;
			//next 2 can be async
			saveNewImage(req.body.image.filename, filename);
			createCroppedImages(req, filename, req.body.cropper);
		} catch (err) {
			console.log(err);
		}
	}

	var movie = new req.dm.Movie(movie);
	movie.save(function (err) {
		if (err)
			return next(err);
		console.log(req.session.username + ' created a new movie ' + movie.title);
		res.redirect('/admin');
	});
});

// Edit a movie
router.post('/:id([0-9a-f]{24})', function (req, res) {
	var movie = req.body.movie;
	var objectId = req.params.id;
	if (req.body.image.filename && req.body.cropper) { // there is a image for this movie
		try {
			var filename = req.body.image.filename;
			if (req.body.image.new && req.body.image.new == "true") { // image is new
				while (fs.existsSync("./public/img/movies/o_" + filename)
					 || fs.existsSync("./public/img/movies/b_" + filename)
					 || fs.existsSync("./public/img/movies/s_" + filename)) {
					filename = "_" + filename;
				}

				saveNewImage(req.body.image.filename, filename);
			}
			// at this point there is a image at /public/img/movies/o_filename.png
			createCroppedImages(req, filename, req.body.cropper);
			movie.imagefile = filename;
			movie.imagecropper = req.body.cropper;
		} catch (err) {
			console.log(err);
		}
	}
	req.dm.Movie.update({_id : objectId}, movie, function(err){
		if (err) return next(err);
		console.log("User " + req.session.user.username + " edited the movie " + movie.title);
		res.redirect('/admin');
	});
});

// image posting
router.post('/imageupload', upload.single('img'), function (req, res) {
	if (req.file != undefined && req.file.mimetype.match("image/*")) {
		var tmp_path = req.file.path;
		var filename = req.file.originalname;
		var target_path = './public/img/upload/';
		while (fs.existsSync(target_path + filename)) {
			filename = "_" + filename;
		}

		// copy the uploaded file
		var src = fs.createReadStream(tmp_path);
		var dest = fs.createWriteStream(target_path + filename, {
				mode: 0x777
			});
		src.pipe(dest);
		src.on('end', function () {
			console.log("User " + req.session.user.username + " uploaded file " + filename + " successfully");
			res.json({
				success: 1,
				path: "/public/img/upload/" + filename,
				filename: filename,
				msg: "File uploaded successfully"
			});
		});
		src.on('error', function (err) {
			console.log("Error uploading file");
			res.json({
				success: 0,
				msg: "Error uploading file"
			});
		});
	} else {
		console.log("Error uploading file, file not set or wrong type");
		res.json({
			success: 0,
			msg: "Error uploading file, file not set or wrong type"
		});
	}
});

// image moving and modifying functions
function saveNewImage(filename, newfilename) {
	if (!filename)
		throw new Error("Filename not set");
	if (!fs.existsSync("./public/img/upload/" + filename))
		throw new Error("File doesn't exist");
	fs.renameSync("./public/img/upload/" + filename, "./public/img/movies/o_" + newfilename);
}
function createCroppedImages(req, filename, cropdata, callback) {
	//image saved at /public/img/movies, crop it and save
	jimp.read("./public/img/movies/o_" + filename, function (err, img) {
		if (err) {
			console.log(err);
			if (callback)
				callback(err);
		} else {
			img.crop(Number(req.body.cropper.x), Number(req.body.cropper.y),
				Number(req.body.cropper.width), Number(req.body.cropper.height))
			.resize(91 * 12, 134 * 12)
			.write("./public/img/movies/b_" + filename)
			.resize(91 * 3, 134 * 3)
			.write("./public/img/movies/s_" + filename)
			if (callback)
				callback();
		}
	});
}

//export this router to use in our index.js
module.exports = router;