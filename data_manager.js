var fs = require('fs');

function loadMovies(callback){
	fs.readFile('./data/movies.json', 'utf-8', function(err, data) {
			if(err){
				console.log(err);
				callback(err, undefined);
			} else {
				movies = JSON.parse(data).movies;
				callback(undefined, movies);
			}
	});
}


/* HMM, this is maybe bad */
function getMovie(callback){
	loadMovies(function(err, movies){
		if(err){
			next(err);
		} else {
			var movie = req.movies.filter(function(m){
				if(m.id == req.params.id)
					return true;
			});
			if(movie.length != 1){
				callback({error: "Error fetching movies"}, undefined);
			} else {
				callback(undefined, movie[0]);
			}
		}
	});
}

exports.loadMovies = loadMovies;
exports.getMovie = getMovie;