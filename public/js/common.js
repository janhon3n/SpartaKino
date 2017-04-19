$(document).ready(function(){
	
	$('.hideable .hidebutton').click(function(){
		$(this).closest('.hideable').find('.hidecontent').slideToggle();
	});
});

function confirmPrompt($el, textt, f1text, f2text, f1, f2){
	$el.html('<div class="confirmPrompt">'+textt
	+ '<a class="f1">'+f1text+'</a><a class="f2">'+f2text+'</a></div>');
	$confirmPrompt = $el.find('.confirmPrompt');
	console.log($confirmPrompt)
	$confirmPrompt.slideDown();
	$confirmPrompt.find('a.f1').click(function(){
		f1(function(){
			$confirmPrompt.slideUp(function(){
				$confirmPrompt.remove();
			});	
		});
	});
	$confirmPrompt.find('a.f2').click(function(){
		f2(function(){
			$confirmPrompt.slideUp(function(){
				$confirmPrompt.remove();
			});
		});
	});
}