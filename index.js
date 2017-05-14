/*
The main file of the project.
Run this if you want to run Spartakino.

This file requires needed modules,
then sets up middleware for requests,
and then sets up routes,
and finally sets up error handling and runs the app.
*/

var DEBUGGING = false;

var config = require('./config.js')
var express = require('express')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser')
var sassMiddleware = require('node-sass-middleware')
var path = require('path');
var app = express()
var dm = require('./data_manager.js')
app.locals.moment = require('moment');
var idGiver = 0;

app.set('view engine', 'pug')
app.set('views', './views')

//use sass as a css preprosessor
app.use(sassMiddleware({
	src: './public/style/',
	dest: './public/style/css',
	debug: true,
	outputStyle: 'extended',
	prefix: "/public/style/css/"
}));

app.use(bodyParser.urlencoded({ extended: true })) //To parse URL encoded data
app.use(bodyParser.json()) //To parse json data
app.use(cookieParser()) //To parse cookies



//Set /public folder to be open to every request
app.use('/public', express.static('public'))
//Start session
app.use(session({secret: "aJboIc779c2cCOIJoac"}))

//own middleware for client tracking
app.use(function(req, res, next){
	req.dm = dm;
	
	if(typeof req.cookies.id == 'undefined'){
		//add new id to client with no id. expires after 3 years.
		res.cookie('id', idGiver++, {expire: 94608000000})
		console.log('New client with id: '+(idGiver - 1)+' sent a request')
	} else {
		console.log('Client with id: '+req.cookies.id+' sent a request')
	}
	next()
})

app.use(function(req,res,next){
	req.dm.Screening.find({});
	next();
});

/* Middleware to check if user is logged in */
var requireLogin = function(req,res,next){
	if(req.session.user == undefined){
		res.redirect('/login')
	}
	next();
}

/* Middleware to check if user is admin */
var requireAdmin = function(req,res,next){
	if(req.session.user == undefined || req.session.user.type !== "admin") {
		res.redirect('/')
	}
	next();
}


//Routes
var movies = require('./routes/movies.js')
app.use('/movies', movies)

var tickets = require('./routes/tickets.js')
app.use('/tickets', requireLogin, tickets)

var login = require('./routes/login.js')
app.use('/login', login)

var logout = require('./routes/logout.js')
app.use('/logout', logout)

var register = require('./routes/register.js')
app.use('/register', register)

var moviesapi = require('./routes/api/moviesapi.js')
app.use('/api/movies/', moviesapi)

var theatersapi = require('./routes/api/theatersapi.js')
app.use('/api/theaters/', theatersapi)

var hallsapi = require('./routes/api/hallsapi.js')
app.use('/api/halls/', hallsapi)

var screeningsapi = require('./routes/api/screeningsapi.js')
app.use('/api/screenings/', screeningsapi)

var resorvationsapi = require('./routes/api/resorvationsapi.js')
app.use('/api/resorvations/', resorvationsapi)

var user = require('./routes/user.js')
app.use('/user/', user)

var admin = require('./routes/admin/admin.js')
app.use('/admin/', requireAdmin, admin)

var editmovie = require('./routes/admin/editmovie.js')
app.use('/admin/editmovie/', requireAdmin, editmovie)

var edittheater = require('./routes/admin/edittheater.js')
app.use('/admin/edittheater/', requireAdmin, edittheater)

var editschedule = require('./routes/admin/editschedule.js')
app.use('/admin/editschedule/', requireAdmin, editschedule);


app.get('/', function(req, res){
	res.redirect('/movies')
})

//route for 404
app.all('/api/*', function(req,res,next){
	next({error: '404 not found'});
})
app.all('*', function(req, res){
	res.render('notfound', {path: req.url, user:req.session.user})
})




// Error handling
//   json api
app.use('/api', function(err, req, res, next){
	console.log(err);
	if(DEBUGGING){
		res.json({error:err});
	} else {
		res.json({error:""});
	}
});
//   html pages
app.use('/', function(err,req,res,next){
	console.log(err);
	if(DEBUGGING){
		res.render('error', {user:req.session.user, error:err});
	} else {
		res.render('error', {user:req.session.user, error:"You don't need to worry about this"});
	}
});

server = app.listen(3000, function () {
  console.log('Spartakino running on port 3000!')
})
