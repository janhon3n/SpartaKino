var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var url = 'mongodb://spartakino.dy.fi/spartakino';
mongoose.connect(url);
mongoose.connection.on('error', function(err){
	console.log(err);
});
console.log('Connected to MongoDB')

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

var theaterSchema = new Schema({
	name: {type: String, required: true},
	address: addressSchema,
	halls:[{
			name: String,
			rows: Number,
			cols: Number,
			seats: Number,
			elements: [{
				name: String,
				row: Number,
				col: Number,
				rotation: Number
			}]
		}],
	created_at: Date,
	updated_at: Date
});
theaterSchema.pre('save', updateDates);


var User = mongoose.model('User', userSchema);
var Movie = mongoose.model('Movie', movieSchema);
var Theater = mongoose.model('Theater', theaterSchema);

module.exports.User = User;
module.exports.Movie = Movie;
module.exports.Theater = Theater;