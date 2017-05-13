$(document).ready(function(){
	
	var moviesSave;

	function createMovieHtml(m){
		html = '<div class="movie coolImage popUp" onclick=\'redirect("/movies/movie/'+m._id+'")\'">'
			+ '<img src="/public/img/movies/s_'+m.imagefile+'">'
			+ '<div class="movieInfo">'+m.title+'</div>'
		    + '</div>';
		return html;
	}
	
	function updateMovies(){
		$.getJSON("/api/movies/", function(movies){
			moviesSave = movies;
			var html = '';
			for(var i = 0; i < movies.length; i++){
				html += createMovieHtml(movies[i]);
			}
			$('div#movies div#results').html(html);
		});		
	}
	function searchMovies(searchParams){
		var url = "/api/movies/search/"+searchParams.title + "/";
		console.log(url);
		$.getJSON(url, function(movies){
			moviesSave = movies;
			var html = '';
			movies.forEach(function(m){
				html += createMovieHtml(m)
			})
			$('div#movies div#results').html(html);
		});				
	}
	updateMovies();

	$("div#movies div#search button#updateButton").click(function(){
		var title = $("div#movies div#search input#title").val();
		if(title === "") title = ".*";
		searchMovies({title: title});
	});
});