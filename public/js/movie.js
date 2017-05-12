$(document).ready(function(){
	
	var movie_id = $("div#movie").attr("movie_id");
	var moviesSave;

	function createScreeningRowHtml(s){
		html = '<tr><td class="small">'+s.time+'</td>'
			+ '<td class="medium">'+s.hallName+'</td>'
			+ '<td class="medium">'+s.resorvations+'</td>'
			+ '<td class="medium redirect" onclick=\'redirect("/movies/screening/'+s._id+'/tickets")\'>Get tickets</td>';
		return html;
	}
	
	function searchScreenings(date, theater, movie_id){
		var url = "/api/screenings/search/"+date+"/"+theater+"/"+movie_id;
		console.log(url);
		$.getJSON(url, function(screenings){
			console.log(screenings);
			if(screenings.error){
				console.log(screenings.error);
			} else {
				html = '<tr><th class="small">Time</th><th class="medium">Hall</th><th class="medium">Resorvations</th><th class="medium"></th></tr>';
				screenings.forEach(function(s){
					s.time = moment(s.datetime).format("HH:mm");
					html += createScreeningRowHtml(s);
				});
				$("table#movieScreeningsTable").html(html);
			}
		});				
	}


	function updateSearch(){
		var date = $("input#screeningDate").val();
		var theater = $("select#screeningTheater").val();
		console.log(date + " " + theater);
		searchScreenings(date, theater, movie_id);
	}
	updateSearch();
	
	
	$("button#updateScreeningsButton").click(function(){
		updateSearch();
	});
});