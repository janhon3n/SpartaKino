var jsonFile = require('jsonfile');
var lockFile = require('lockfile');

var moviesFile = './data/movies.json';
var usersFile = './data/users.json';
var theatersFile = './data/theaters.json';
var lockWaitTime = 2000;

function loadJsonFile(filename, callback){
//	lockFile.lock(moviesFile, {wait: lockWaitTime}, function(err){
//		if(err){
//			console.log("ERROR WITH LOCk");
//			console.log(err);
//			callback(err, undefined);
//		} else {
			jsonFile.readFile(filename, function(err2, json) {
//				lockFile.unlock(moviesFile, function(err3){
					if(err2){
						console.log(err2);
						callback(err2, undefined);
//					} else if(err3) {
//						console.log(err3);
//						callback(err3, undefined);
					} else {
						callback(undefined, json);
					}
//				});
			});
//		}
//	});
}


function loadMovies(callback){
	loadJsonFile(moviesFile, function(err, movies) {
		if(err){
			console.log(err);
			callback(err, undefined);
		} else {
			// add additional data
			movies.forEach(function(m){
				m.imagepath = {};
				m.imagepath.orginal = "/public/img/movies/o_" + m.imagefile;
				m.imagepath.big = "/public/img/movies/b_" + m.imagefile;
				m.imagepath.small = "/public/img/movies/s_" + m.imagefile;
			});
			callback(undefined, movies);
		}
	});
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
							if(movies.length > 0){
								movie.id = movies[movies.length - 1].id + 1;
							} else {
								movie.id = 1;
							}
							movies[movies.length] = movie;
						} else {
							//overwrite old movie with same id
							var index = -1;
							for(var i = 0; i < movies.length; i++){
								if(movies[i].id == movie.id) index = i;
							}
							if(index == -1){
								callback(new Error("Movie not found"));
								return;
							} else {
								movies[index] = movie;
							}
						}
						
						//save the modified movies object
						jsonFile.writeFile(moviesFile, movies, function(err3){
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
function deleteMovie(id, callback){
	if(id == undefined || id <= 0)
		callback(new Error("Movie id can't be <= 0"));
	jsonFile.readFile(moviesFile, function(err2, movies) {
		if(err2){
			console.log(err2);
			callback(err2);
		} else {
			movies2 = movies.filter(function(u){
				if(u.id == id) return false;
				return true;
			});
			if(movies2.length != movies.length - 1){
				// no movie with id id found
				callback(new Error("Movie with id "+id+" not found"));
			} else {
				//save the modified movies object
				jsonFile.writeFile(moviesFile, movies2, function(err3, json){
					if(err3){
						console.log(err3);
						callback(err3);
					} else {
	//					lockFile.unlock(moviesFile, function(err4){
	//						if(err4){
	//							console.log(err4);
	//							callback(err4);
	//						} else {
								callback();
	//						}
	//					});
					}
				});		
			}
		}
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
	if(!movie.imagefile){
		movie.imagefile = "default.jpg";
	}
	callback(movie);
}



function loadUsers(callback){
	loadJsonFile(usersFile, function(err, users) {
		if(err){
			console.log(err);
			callback(err, undefined);
		} else {
			callback(undefined, users);
		}
	});
}

function editUser(usr, callback){
	fixUser(usr, function(user){
//		lockFile.lock(usersFile, {wait: lockWaitTime}, function(err){
//			if(err){
//				console.log(err);
//				callback(err);
//			} else {
				jsonFile.readFile(usersFile, function(err2, users) {
					if(err2){
						console.log(err2);
						callback(err2);
					} else {
						if(user.id == undefined || user.id == 0){
							//add user as a new object
							if(users.length > 0){
								user.id = users[users.length - 1].id + 1;
							} else {
								user.id = 1;
							}
							users[users.length] = user;
						} else {
							//overwrite old movie with same id
							var index = -1;
							for(var i = 0; i < users.length; i++){
								if(users[i].id == user.id){
									index = i;
								}
							}
							if(index < 0){
								callback(new Error("User not found"));
								return;
							} else {
								users[index] = user;
							}
						}
						
						//save the modified users object
						jsonFile.writeFile(usersFile, users, function(err3, json){
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
function deleteUser(id, callback){
	if(id == undefined || id <= 0)
		callback(new Error("Movie id can't be <= 0"));
	jsonFile.readFile(usersFile, function(err2, users) {
		if(err2){
			console.log(err2);
			callback(err2);
		} else {
			users2 = users.filter(function(u){
				if(u.id == id) return false;
				return true;
			});
			if(users2.length != users.length - 1){
				// no movie with id id found
				callback(new Error("Movie with id "+id+" not found"));
			} else {
				//save the modified users object
				jsonFile.writeFile(usersFile, users2, function(err3, json){
					if(err3){
						console.log(err3);
						callback(err3);
					} else {
	//					lockFile.unlock(moviesFile, function(err4){
	//						if(err4){
	//							console.log(err4);
	//							callback(err4);
	//						} else {
								callback();
	//						}
	//					});
					}
				});		
			}
		}
	});			
}




/* THEATERS */
function loadTheaters(callback){
	loadJsonFile(theatersFile, function(err, theaters) {
		if(err){
			console.log(err);
			callback(err, undefined);
		} else {
			callback(undefined, theaters);
		}
	});
}

function editTheater(thea, callback){
	fixTheater(thea, function(theater){
//		lockFile.lock(theatersFile, {wait: lockWaitTime}, function(err){
//			if(err){
//				console.log(err);
//				callback(err);
//			} else {
				jsonFile.readFile(theatersFile, function(err2, theaters) {
					if(err2){
						console.log(err2);
						callback(err2);
					} else {
						if(theater.id == undefined || theater.id == 0){
							//add theater as a new object
							if(theaters.length > 0){
								theater.id = theaters[theaters.length - 1].id + 1;
							} else {
								theater.id = 1;
							}
							theaters[theaters.length] = theater;
						} else {
							//overwrite old theater with same id
							var index = -1;
							for(var i = 0; i < theaters.length; i++){
								console.log(theaters[i])
								console.log(theater)
								if(theaters[i].id == theater.id){
									index = i;
								}
							}
							console.log(index);
							if(index < 0){
								callback(new Error("theater not found"));
								return;
							} else {
								theaters[index] = theater;
							}
						}
						
						console.log("JSON TO WRITE: ");
						console.log(theaters);
						//save the modified theaters object
						jsonFile.writeFile(theatersFile, theaters, function(err3){
							if(err3){
								console.log(err3);
								callback(err3);
							} else {
//								lockFile.unlock(theatersFile, function(err4){
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
function deleteTheater(id, callback){
	if(id == undefined || id <= 0)
		callback(new Error("Theater id can't be <= 0"));
	jsonFile.readFile(theatersFile, function(err2, theaters) {
		if(err2){
			console.log(err2);
			callback(err2);
		} else {
			theaters2 = theaters.filter(function(u){
				if(u.id == id) return false;
				return true;
			});
			if(theaters2.length != theaters.length - 1){
				// no theater with id id found
				callback(new Error("theater with id "+id+" not found"));
			} else {
				//save the modified theaters object
				jsonFile.writeFile(theatersFile, theaters2, function(err3, json){
					if(err3){
						console.log(err3);
						callback(err3);
					} else {
	//					lockFile.unlock(theatersFile, function(err4){
	//						if(err4){
	//							console.log(err4);
	//							callback(err4);
	//						} else {
								callback();
	//						}
	//					});
					}
				});		
			}
		}
	});			
}
function fixTheater(theater, callback){
	if(!theater.name){
		theater.year = "No Name No Name";
	}
	if(!theater.address){
		theater.address = "";
	}
	callback(theater);
}


//Middleware functions
function loadMoviesMW(req,res,next){
	loadMovies(function(err, movies){
		if(err){
			console.log(err.getMessage());
			next(err);
		} else {
			req.movies = movies;
			next();
		}
	});
}
function loadUsersMW(req,res,next){
	loadUsers(function(err, users){
		if(err){
			console.log(err.getMessage());
			next(err);
		} else {
			req.users = users;
			next();
		}
	});
}
function loadTheatersMW(req,res,next){
	loadTheaters(function(err, theaters){
		if(err){
			console.log(err.message);
			next(err);
		} else {
			req.theaters = theaters;
			next();
		}
	});
}


exports.loadMovies = loadMovies;
exports.editMovie = editMovie;
exports.deleteMovie = deleteMovie;

exports.loadUsers = loadUsers;
exports.editUser = editUser;
exports.deleteUser = deleteUser;

exports.loadTheaters = loadTheaters;
exports.editTheater = editTheater;
exports.deleteTheater = deleteTheater;

exports.loadMoviesMW = loadMoviesMW;
exports.loadUsersMW = loadUsersMW;
exports.loadTheatersMW = loadTheatersMW;