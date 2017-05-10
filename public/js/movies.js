$(document).ready(function(){
	
	var moviesSave;

	function createMovieHtml(m){
		html = '<div class="movie" onclick=\'redirect("/movies/movie/'+m._id+'")\'">'
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
			setMoviesFunctionality();
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
			setMoviesFunctionality();
		});				
	}
	updateMovies();

	$("div#movies div#search button#updateButton").click(function(){
		var title = $("div#movies div#search input#title").val();
		if(title === "") title = "*";
		searchMovies({title: title});
	});

	function setMoviesFunctionality(){
		$('div.movie img').click(function(){
			var movieId = Number($(this).attr("movie_id"));
			var movs = movies.filter(function(m){
				if(m.id == movieId) return true;
				return false;
			});
			$("div#movieContent").html(createMovieContentHtml(movs[0]));
		});
	}
});