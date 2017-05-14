$(document).ready(function(){
	
	var movie_id = $("div#movie").attr("movie_id");
	var moviesSave;

	function addScreeningToTable(s){
		console.log(s);
		var html = '<tr><td class="small center">'+s.time+'</td>'
			+ '<td class="medium">'+s.hallName+'</td>'
			+ '<td class="medium center">'+s.freeSeats.normal.free+' normal, '+s.freeSeats.wheelchair.free+' wheelchair</td>'
			+ '<td class="medium redirect" onclick=\'redirect("/tickets/screening/'+s._id+'/tickets")\'>Get tickets</td>';

		$("table#movieScreeningsTable").append(html);

	}
	
	function searchScreenings(date, theater, movie_id){
		var url = "/api/screenings/search/"+date+"/"+theater+"/"+movie_id;
		console.log(url);
		$.getJSON(url, function(screenings){
			if(screenings.error){
				console.log(screenings.error);
			} else {
				var html;
				if(screenings.length != 0){
					html = '<tr><th class="small">Time</th><th class="medium">Hall</th><th class="medium">Seats available</th><th class="medium"></th></tr>';
					$("table#movieScreeningsTable").html(html);
					screenings.forEach(function(s){
						s.time = moment(s.datetime).format("HH:mm");
						$.get("/api/resorvations/screening/"+s._id+"/amount", function(amount){
							if(amount.error){
								console.log(amount.error);
							} else {
								s.freeSeats = amount;
								s.freeSeats.normal.free = Number(s.freeSeats.normal.max) - Number(s.freeSeats.normal.reserved);
								s.freeSeats.wheelchair.free = Number(s.freeSeats.wheelchair.max) - Number(s.freeSeats.wheelchair.reserved);
								addScreeningToTable(s);
							}
						});
					});
				} else {
					html += '<tr><th>There are no screening for the set date and theater</th></tr>';
					$("table#movieScreeningsTable").html(html);
				}
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