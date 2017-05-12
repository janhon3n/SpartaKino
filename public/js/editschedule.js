$(document).ready(function(){
	
	var theater_id = $('div#editschedule').attr('theater_id');
	var hall_id = $('div#editschedule').attr('hall_id');
	var week = $('div#editschedule').attr('week');

	$timetd = $('table#scheduleTable tr.content div[type="time"]');
	for(i = 0; i < 24; i++){
		$timetd.append('<div class="elevator" style="top:'+ (100/24 * i) +'%;">'+i+':00<div>');
	}
	var now = moment();
	var day = now.weekday();
	var weekstart = now.clone().weekday(0).hours(0).minutes(0).seconds(0);
	console.log(weekstart);
	


	
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
							var date = moment(s.datetime);
							s.day = date.day();
							s.date = date.format("DD.MM.YYYY");
							s.time = date.format("HH:mm");
							s.name = s.date + " " +s.time;
							s.minutes = (date.hours() * 60) + date.minutes();
							console.log(s.minutes);
							var enddate = moment(date);
							enddate.minutes(enddate.minutes() + s.length);
							s.endtime = enddate.hours() + ":" + enddate.minutes();
						
							
							//create list row
							$('div#editschedule table#scheduleList').append('<tr name="'+s.name +'" screening_id="'+s._id+'" type="screening">'
								+'<td class="small center">'+s.date+'</td>'
								+'<td class="small center">'+s.time+'</td>'
								+'<td>'+s.movietitle+'</td>'
								+'<td>'+s.resorvations.count + s.hall.seats + '</td>'
								+'<td class="edit small" onclick=\'redirect("/admin/editschedule/editscreening/theater/'+theater_id+'/hall/'+hall_id+'/'+s._id+'")\'>edit</td>'
								+'<td class="delete small">delete</td></tr>');

								
							//draw to timetable if on this week
							if(weekstart.isBefore(date) && weekstart.clone().add(7, "days").isAfter(date)){
								//create timetable item
								createScreeningElevator((s.minutes / 1440) * 100, (s.length / 1440) * 100, s);
								if(s.minutes + s.length > 1440){
									createScreeningElevator((s.minutes / 1440) * 100 - 100, (s.length / 1440) * 100, s);
								}
							}
						}
					});
					setupTableDeletes();
					$('table#scheduleTable tr.content div[type="day"][day="'+day+'"]').append('<div class="nowmarker elevator"'
					+ 'style="top:'+(((now.hours() * 60 + now.minutes()) / 1440) * 100)+'%;">'
					+ '</div>');
					
					function createScreeningElevator(fromTop, height, s){
						$('div#editschedule table#scheduleTable div[type="day"][day="'+s.day+'"]')
						.append('<div class="elevator elevatorBox" '
							+'style="top:'+fromTop+'%;height:'+height+'%">'
							+s.movietitle+'<br>'+s.time+' - '+s.endtime+'</div>');
					}
				}
			});
		}
	});
	
	$("select#hallSelect").on("change", function(){
		console.log(this.value);
		redirect("/admin/editschedule/theater/"+theater_id+"/hall/"+this.value+"/week/"+week);
	});
});