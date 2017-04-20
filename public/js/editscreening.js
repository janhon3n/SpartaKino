$(document).ready(function () {
	$('div#editscreening input[type="radio"][name="showtimes[radio]"]').change(function(){
		console.log(this.value)
		if(this.value=="multiple"){
			$('div#editscreening div.weekCountInput').slideDown();
		} else if(this.value=="single"){
			$('div#editscreening div.weekCountInput').slideUp();
		}
	})
});