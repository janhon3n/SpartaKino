$(document).ready(function(){
	$("button#addActorButton").click(function(){
		var index = $(this).parent().parent().find('div#actorsRow input:last-child').attr("actorindex");
		index++;
		$("div#actorsRow").append(createActorInput(index));
	});
	$("button#removeActorButton").click(function(){
		$(this).parent().parent().find('div#actorsRow input:last-child').remove();
	});
	
	function createActorInput(ai){
		return '<input type="text" actorindex="'+ai+'" name="movie[actors]['+ai+'][name]">';
	}
});