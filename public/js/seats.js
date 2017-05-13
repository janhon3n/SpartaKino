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
		var picked = seatPicker.getPicked();
		var incorrect = false;
		if(picked.normal.length != tickets.normal){
			incorrect = true;
			$("div#info").append('<div>Pick '+(tickets.normal - picked.normal.length) + ' more normal seats</div>');
		}
		if(picked.wheelchair.length != tickets.wheelchair){
			incorrect = true;
			$("div#info").append('<div>Pick '+(tickets.wheelchair - picked.wheelchair.length) + ' more wheelchair seats</div>');
		}
		if(incorrect){
			e.preventDefault();
		} else {
			for(var i = 0; i < picked.normal.length; i++){
				$("div#seats form").append("<input type='hidden' name='picked[normal]["+i+"][row]' value='"+picked.normal[i].row+"'>");
				$("div#seats form").append("<input type='hidden' name='picked[normal]["+i+"][col]' value='"+picked.normal[i].col+"'>");
			}
			for(var i = 0; i < picked.wheelchair.length; i++){
				$("div#seats form").append("<input type='hidden' name='picked[wheelchair]["+i+"][row]' value='"+picked.wheelchair[i].row+"'>");
				$("div#seats form").append("<input type='hidden' name='picked[wheelchair]["+i+"][col]' value='"+picked.wheelchair[i].col+"'>");				
			}
		}
	});
});