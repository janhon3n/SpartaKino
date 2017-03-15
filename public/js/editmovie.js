$(document).ready(function(){
	$("button#addActorButton").click(function(){
		$("div#actorsRow").append(createActorInput());
	});
	$("button#removeActorButton").click(function(){
		$(this).parent().parent().find('div#actorsRow input[name="actor"]:last-child').remove();
	});
	
	function createActorInput(){
		return '<input type="text" name="actor">';
	}
});