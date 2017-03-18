$(document).ready(function(){
	$("table#moviesTable a.remove").click(function(){
		var elem = $(this);
		var id = elem.attr("movie_id");
		$.ajax({
			url: '/api/movies/delete/id/'+id,
			type: 'POST',
			success: function(result) {
				if(result.success == "success"){
					elem.parent().parent().hide();
				}
			}
		});
	});
});