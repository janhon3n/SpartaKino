$(document).ready(function(){
	
	$('.hideable .hidebutton').click(function(){
		$(this).closest('.hideable').find('.hidecontent').slideToggle();
	});
});