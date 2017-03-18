$(document).ready(function(){
	
	function createMovieHtml(m){
		html = '<a class="movielink" href="/movies/movie/'+m.id+'">'
			+ '<div class="movie">'
			+ '<img src="/public/img/movies/s_'+m.imagefile+'">'
			+ '<h2>'+m.title+'</h2>'
			+ '<p>'+m.description+'</p>'
			+ '<li>Year: '+m.year+'</li><li>Director: '+m.director+'</li></div></a>';
		return html;
	}
	
	function updateMovies(fr, amount){
		$.getJSON("/api/movies/amount/"+fr+"/"+amount, function(movies){
			var html = '';
			movies.forEach(function(m){
				html += createMovieHtml(m);
			})
			$('div#movies div#results').html(html);
		});		
	}
	function searchMovies(searchParams){
		var url = "/api/movies/search/"+searchParams.title + "/";
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
	updateMovies(0,10);

	$("div#movies div#search button#updateButton").click(function(){
		var title = $("div#movies div#search input#title").val();
		if(title === "") title = "*";
		searchMovies({title: title});
	});
});