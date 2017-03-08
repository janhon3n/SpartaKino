var config = require('./config.js')
var express = require('express')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var app = express()
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

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }))
//To parse json data
app.use(bodyParser.json())

app.use('/public', express.static('public'))
app.use(cookieParser())
app.use(session({secret: "aJboIc779c2cCOIJoac"}))

//own middleware for client tracking
app.use(function(req, res, next){
	if(typeof req.cookies.id == 'undefined'){
		//add new id to client with no id. expires after 3 years.
		res.cookie('id', idGiver++, {expire: 94608000000})
		console.log('New client with id: '+(idGiver - 1)+' sent a request')
	} else {
		console.log('Client with id: '+req.cookies.id+' sent a request')
	}
	next()
})


//routes
var movies = require('./routes/movies.js')
app.use('/movies', movies)

var login = require('./routes/login.js')
app.use('/login', login)

var logout = require('./routes/logout.js')
app.use('/logout', logout)

var register = require('./routes/register.js')
app.use('/register', register)

var api = require('./routes/api/moviesapi.js')
app.use('/api/movies', api)

var user = require('./routes/user.js')
app.use('/user/', user)

var admin = require('./routes/admin.js')
app.use('/admin/', admin)


app.get('/', function(req, res){
	res.redirect('/movies')
})
//route for 404
app.all('*', function(req, res){
	res.render('notfound', {path: req.url})
})



server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})