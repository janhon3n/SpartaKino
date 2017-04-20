$(document).ready(function(){
	
	$('.hideable .hidebutton').click(function(){
		$(this).closest('.hideable').find('.hidecontent').slideToggle();
	});
});

function confirmPrompt($el, textt, f1text, f2text, f1, f2){
	if($el.find('.confirmPrompt').length == 1){
		console.log('moi');
		$el.find('.confirmPrompt').slideUp(function(){
			$el.find('.confirmPrompt').remove();
			createNewConfirmPrompt($el, textt, f1text, f2text, f1, f2);
		});
	} else {
		createNewConfirmPrompt($el, textt, f1text, f2text, f1, f2);
	}
}

function redirect(url){
	window.location.href = url;
}

function createNewConfirmPrompt($el, textt, f1text, f2text, f1, f2){
	$el.html('<div class="confirmPrompt">'+textt
	+ '<a class="f1">'+f1text+'</a><a class="f2">'+f2text+'</a></div>');
	//if hidden slide down
	if($el.find('.confirmPrompt:hidden').length == 1){
		$el.find('.confirmPrompt').slideDown();
	}
	$el.find('.confirmPrompt').find('a.f1').click(function(){
		f1(function(){
			$el.find('.confirmPrompt').slideUp(function(){
				$el.find('.confirmPrompt').remove();
			});	
		});
	});
	$el.find('.confirmPrompt').find('a.f2').click(function(){
		f2(function(){
			$el.find('.confirmPrompt').slideUp(function(){
				$el.find('.confirmPrompt').remove();
			});
		});
	});
}