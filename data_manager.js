var jsonFile = require('jsonfile');
var lockFile = require('lockfile');

var moviesFile = './data/movies.json';
var lockWaitTime = 2000;

function loadMovies(callback){
//	lockFile.lock(moviesFile, {wait: lockWaitTime}, function(err){
//		if(err){
//			console.log("ERROR WITH LOCk");
//			console.log(err);
//			callback(err, undefined);
//		} else {
			jsonFile.readFile(moviesFile, function(err2, movies) {
//				lockFile.unlock(moviesFile, function(err3){
					if(err2){
						console.log(err2);
						callback(err2, undefined);
//					} else if(err3) {
//						console.log(err3);
//						callback(err3, undefined);
					} else {
						callback(undefined, movies);
					}
//				});
			});
//		}
//	});
}

function editMovie(mov, callback){
	fixMovie(mov, function(movie){
//		lockFile.lock(moviesFile, {wait: lockWaitTime}, function(err){
//			if(err){
//				console.log(err);
//				callback(err);
//			} else {
				jsonFile.readFile(moviesFile, function(err2, movies) {
					if(err2){
						console.log(err2);
						callback(err2);
					} else {
						if(movie.id == undefined || movie.id == 0){
							//add movie as a new object
							movie.id = movies[movies.length - 1].id + 1;
							movies[movies.length] = movie;
						} else {
							//overwrite old movie with same id
							var index = 0;
							for(var i = 0; i < movies.length; i++){
								if(movies[i].id == i){
									index = i;
								}
							}
							if(index == 0){
								callback(new Error("Movie not found"));
								return;
							} else {
								movies[index] = movie;
							}
						}
						
						//save the modified movies object
						jsonFile.writeFile(moviesFile, movies, function(err3, json){
							if(err3){
								console.log(err3);
								callback(err3);
							} else {
//								lockFile.unlock(moviesFile, function(err4){
//									if(err4){
//										console.log(err4);
//										callback(err4);
//									} else {
										callback();
//									}
//								});
							}
						});
						
					}
				});			
//			}
//		});
	});
}

function fixMovie(movie, callback){
	if(!movie.title){
		movie.title = "No Name No Name";
	}
	if(!movie.year){
		movie.year = 2000;
	}
	if(!movie.director){
		movie.director = "";
	}
	if(!movie.actors){
		movie.actors = [];
	}
	if(!movie.description){
		movie.description = "";
	}
	if(!movie.screenings){
		movie.screenings = [];
	}
	callback(movie);
}


exports.loadMovies = loadMovies;
exports.editMovie = editMovie;