$(document).ready(function(){
	
	function createMovieHtml(m){
		html = '<a class="movielink" href="/movies/movie/'+m.id+'">'
			+ '<div class="movie">'
			+ '<h2>'+m.name+'</h2>'
			+ '<p>'+m.description+'</p>'
			+ '<li>Year: '+m.year+'</li><li>Director: '+m.director+'</li></div></a>';
		return html;
	}
	
	function updateMovies(fr, amount){
		$.getJSON("/api/movies/amount/"+fr+"/"+amount, function(movies){
			console.log(movies);
			var html = '';
			movies.forEach(function(m){
				html += createMovieHtml(m);
			})
			$('div#movies div#results').html(html);
		});		
	}
	function searchMovies(searchParams){
		var url = "/api/movies/search/"+searchParams.name + "/";
		console.log(url);
		$.getJSON(url, function(movies){
			console.log(movies);
			var html = '';
			movies.forEach(function(m){
				html += createMovieHtml(m)
			})
			$('div#movies div#results').html(html);
		});				
	}
	updateMovies(0,5)

	$("div#movies div#search button#updateButton").click(function(){
		var name = $("div#movies div#search input#title").val();
		if(name === "") name = "*";
		searchMovies({name: name});
	});
});