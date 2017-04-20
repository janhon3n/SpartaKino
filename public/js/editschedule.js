$(document).ready(function(){
	$timetd = $('table#scheduleTable tr.content div[type="time"]');
	for(i = 0; i < 24; i++){
		$timetd.append('<div class="elevator" style="top:'+ (100/24 * i) +'%;">'+i+':00<div>');
	}
		
	var theater_id = $('div#editschedule').attr('theater_id');
	var hall_id = $('div#editschedule').attr('hall_id');
	var week = $('div#editschedule').attr('week');
	
	$.get('/api/screenings/theater/'+theater_id+'/hall/'+hall_id, function(screenings){
		console.log(screenings);
		if(!screenings){
			console.log('error fetching screenings');
		} else if(screenings.error){
			console.log(screenings.error);
		} else {
			$.get('/api/movies', function(movies){
				if(movies.error){
					console.log(movies.error);
				} else {
					screenings.forEach(function(s){
						var movie = movies.filter(function(m){
							if(m._id == s.movie) return true;
							return false;
						});
						if(movie.length != 1){
							console.log('Movie for screning doesnt exist');
						} else {
							s.movietitle = movie[0].title;
							s.length = movie[0].length;
							var date = new Date(s.date + ' ' + s.time);
							s.day = date.getDay();
							s.minutes = (date.getHours() * 60) + date.getMinutes();
							console.log(s.minutes);
							
							//create list row
							$('div#editschedule table#scheduleList').append('<tr>'
								+'<td class="small center">'+s.date+'</td>'
								+'<td class="small center">'+s.time+'</td>'
								+'<td>'+s.movietitle+'</td>'
								+'<td>jotai</td>'
								+'<td class="edit small">edit</td>'
								+'<td class="delete small">delete</td></tr>');

								
							//draw to timetable if on this week
							var now = new Date();
							var day = now.getDay();
							var weekstart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (day == 0?-6:1)- day + (week * 7));
							if(date.getTime() >= weekstart.getTime() && date.getTime() <= weekstart.getTime() + (7*24*60*60*1000)){
								//create timetable item
								$('div#editschedule table#scheduleTable div[type="day"][day="'+s.day+'"]')
									.append('<div class="elevator elevatorBox" '
										+'style="top:'+((s.minutes / 1440) * 100)+'%;height:'+((s.length / 1440) * 100)+'%">'
										+s.movietitle+'</div>');
								if(s.minutes + s.length >  1440){
									$('div#editschedule table#scheduleTable div[type="day"][day="'+s.day+'"]')
										.append('<div class="elevator elevatorBox" '
											+'style="top:'+((s.minutes / 1440) * 100 - 100)+'%;height:'+((s.length / 1440) * 100)+'%">'
											+s.movietitle+'</div>');
								}
							}
						}
					});
				}
			});
		}
	});
});