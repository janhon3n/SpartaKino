var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var url = 'mongodb://spartakino.dy.fi/spartakino';
var connectWithRetry = function() {
	mongoose.connect(url, function(err){
		if(err) {
			console.log(err);
			setTimeout(connectWithRetry, 5);
		}
	});
}
connectWithRetry();


console.log('Connected to MongoDB')


var ObjectId = mongoose.Schema.Types.ObjectId;

var updateDates = function(next){
	var currentDate = new Date();
	this.updated_at = currentDate;
	
	if(!this.created_at)
		this.created_at = currentDate;
	
	next();
}

var addressSchema = new Schema({
	street: String, 
	city:String,
	postcode: {type:String, }
})


var userSchema = new Schema({
	email: {type: String, unique: true, required: true},
	passhash: {type: String, required: true},
	type: {type: String, enum:['basic', 'admin'], default:'basic', required: true},
	address: addressSchema,
	created_at: Date,
	updated_at: Date
});
userSchema.pre('save', updateDates);

var movieSchema = new Schema({
	title: {type: String, required:true},
	description: String,
	year: {type: Number, min:1900, max:2100},
	length: {type:Number, min:1, max:1000, required:true},
	director: String,
	actors: [{name: String}],
	imagefile: String,
	imagecropper: {
		x: Number,
		y: Number,
		width: Number,
		height: Number
	},
	created_at: Date,
	updated_at: Date
});
movieSchema.virtual('imagepath.orginal').get(function(){
	return '/public/img/movies/o_'+this.imagefile;
});
movieSchema.virtual('imagepath.small').get(function(){
	return '/public/img/movies/s_'+this.imagefile;
});
movieSchema.virtual('imagepath.big').get(function(){
	return '/public/img/movies/b_'+this.imagefile;
});
movieSchema.pre('save', updateDates);


var hallSchema = new Schema({
	theater: {type: ObjectId, required: true},
	name: {type: String, required: true},
	rows: {type: Number, required: true},
	cols: {type: Number, required: true},
	seats: {type: Number, required: true},
	elements: [{
		name: String,
		row: Number,
		col: Number,
		rotation: Number
	}],
	created_at: Date,
	updated_at: Date
});
hallSchema.pre('save', updateDates);


var theaterSchema = new Schema({
	name: {type: String, required: true},
	address: addressSchema,
	halls:[hallSchema],
	created_at: Date,
	updated_at: Date
});
theaterSchema.pre('save', updateDates);

var resorvationSchema = new Schema({
	user: {type: ObjectId, required: true},
	screenings: {type: ObjectId, required: true},
	created_at: Date,
	updated_at: Date
})
resorvationSchema.pre('save', updateDates);

var screeningSchema = new Schema({
	movie: {type: ObjectId, required: true},
	hall: {type: ObjectId, required: true},
	time: {type: String, required: true},
	date: {type: String, required: true},
	price: {type: Number, required: true},
	resorvations: [resorvationSchema],
	created_at: Date,
	updated_at: Date
})
screeningSchema.virtual('name').get(function(){
	return this.date + " " + this.time;
});
screeningSchema.pre('save', updateDates);
screeningSchema.path('time').validate(function(value) {
	var hours = Number(value.substring(0,2));
	if(!(hours >= 0 && hours < 24)) return false;
	var minutes = Number(value.substring(3,5));
	if(!(minutes >= 0 && minutes < 60)) return false;
	return true;
}, 'Time format invalid');

screeningSchema.path('date').validate(function(value) {
	console.log(value);
	var year = Number(value.substring(0,4));
	if(!(year >= 2015 && year < 3000)) return false;
	var month = Number(value.substring(5,7));
	if(!(month >= 1 && month <= 12)) return false;
	var day = Number(value.substring(8,10));
	if(!(day >= 1 && day <= 31)) return false;
	return true;
}, 'Date format invalid');


var User = mongoose.model('User', userSchema);
var Movie = mongoose.model('Movie', movieSchema);
var Theater = mongoose.model('Theater', theaterSchema);
var Hall = mongoose.model('Hall', hallSchema);
var Screening = mongoose.model('Screening', screeningSchema);
var Resorvation = mongoose.model('Resorvation', resorvationSchema);

module.exports.User = User;
module.exports.Movie = Movie;
module.exports.Theater = Theater;
module.exports.Hall = Hall;
module.exports.Screening = Screening;
module.exports.Resorvation = Resorvation;