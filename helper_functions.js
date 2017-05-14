var countAvailable = function(resorvations, screening){
	normal = resorvations.filter(function(r){
		return (r.type == 'normal')
	});
	wheelchair = resorvations.filter(function(r){
		return (r.type == 'wheelchair')
	});
	var availableCount = {};
	availableCount.normal = screening.hall.seats - normal.length;
	availableCount.wheelchair = screening.hall.wheelchair_seats - wheelchair.length;
	return availableCount;
}
exports.countAvailableResorvations = countAvailable;