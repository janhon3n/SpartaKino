$(document).ready(function(){
	
	function createMovieHtml(m){
		html = '<div class="movie">'
			+ '<img src="/public/img/movies/s_'+m.imagefile+'">'
			+ '<div class="hidecontent">'
			+ '<a class="movielink" href="/movies/movie/'+m.id+'">'
			+ '<h2>'+m.title+'</h2></a>'
			+ '<p>'+m.description+'</p>'
			+ '<li>Year: '+m.year+'</li><li>Director: '+m.director+'</li></div></div>';
		return html;
	}
	
	function updateMovies(fr, amount){
		$.getJSON("/api/movies/amount/"+fr+"/"+amount, function(movies){
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
			console.log(movies);
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
			$(this).parent().find('div.hidecontent').slideToggle();
		});
	}


});