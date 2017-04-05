$(document).ready(function(){
	
	var moviesSave;

	function createMovieHtml(m){
		html = '<div class="movie">'
			+ '<img src="/public/img/movies/s_'+m.imagefile+'" movie_id="'+m.id+'">'
			+ '</div>';
		return html;
	}
	function createMovieContentHtml(m){
		return '<div class="movieContent">'
		+ '<a class="movielink" href="/movies/movie/'+m.id+'">'
		+ '<h2>'+m.title+'</h2></a>'
		+ '<p>'+m.description+'</p>'
		+ '<li>Year: '+m.year+'</li><li>Director: '+m.director+'</li></div>';
	}
	
	function updateMovies(fr, amount){
		$.getJSON("/api/movies/amount/"+fr+"/"+amount, function(movies){
			moviesSave = movies;
			var html = '';
			movies.forEach(function(m){
				html += createMovieHtml(m);
			})
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
	updateMovies(0,10);

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