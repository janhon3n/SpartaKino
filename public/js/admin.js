$(document).ready(function(){
	console.log(confirmPrompt);
	
	$("table td.delete").click(function(){
		$el = $(this).closest('tr');
		$confirmEl = $el.closest('.tableContainer').find('div.confirmContainer');
		confirmPrompt($confirmEl, 'Delete ' + $el.attr("type") +' '+ $el.attr("name") + '?', 'Delete', 'Cancel', function(callback){
			deleteRow($el, callback);
		}, function(callback){
			callback();
		});
	});
	
	
	function deleteRow($el, callback){
		var url;
		if(!$el) return;
		var type = $el.attr('type');
		var id = $el.attr(type+'_id');
		if(!type || !id) return;
		url = '/api/' + type + 's/delete/id/'+id;
		console.log(url);
		$.ajax({
			url: url,
			type: 'POST',
			success: function(result) {
				console.log(result);
				if(result.error){
					console.log(result.error);
				} else {
					$el.slideUp(function(){
						$el.remove();
						callback();
					});
				}
			}
		});
	}
});