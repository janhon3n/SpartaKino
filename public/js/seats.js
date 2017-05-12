console.log("pöö");
$(document).ready(function(){
	var hall_id = $("div#seats").attr("hall_id");
	var screening_id = $("div#seats").attr("screening_id");
	var tickets = {};
	var seatPicker;

	tickets.normal = $("div#seats").attr("tickets_normal");
	tickets.wheelchair = $("div#seats").attr("tickets_wheelchair");

	console.log(hall_id);
	$.get("/api/halls/id/"+hall_id+"/resorvations/screening/"+screening_id, function(hall){
		if(hall.error){
			console.log(hall.error);
		} else {
			seatPicker = new SeatPicker($("div#seatpicker"), hall, 1000, tickets);
			seatPicker.createSVGHtml();
			seatPicker.createJavascript();
			console.log(seatPicker);
		}
	});
	
	$("div#seats form").submit(function(e){
		$("div#info").html("");
		console.log("getting picked");
		var picked = seatPicker.getPicked();
		if(picked.normal.length != tickets.normal){
			e.preventDefault();
			$("div#info").append('<div>Pick '+(tickets.normal - picked.normal.length) + ' more normal seats</div>');
		}
		if(picked.wheelchair.length != tickets.wheelchair){
			e.preventDefault();
			$("div#info").append('<div>Pick '+(tickets.wheelchair - picked.wheelchair.length) + ' more wheelchair seats</div>');
		}
		
		
	});
});