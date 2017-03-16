$(document).ready(function(){
	$("button#addActorButton").click(function(){
		var index = $(this).parent().parent().find('div#actorsRow input:last-child').attr("actorindex");
		index++;
		$("div#actorsRow").append(createActorInput(index));
	});
	$("button#removeActorButton").click(function(){
		$(this).parent().parent().find('div#actorsRow input:last-child').remove();
	});
	
	function createActorInput(ai){
		return '<input type="text" actorindex="'+ai+'" name="movie[actors]['+ai+'][name]">';
	}

	$('form#imageUpload').submit(function(event) {
		event.preventDefault();
		$("#status").empty().text("File is uploading...");
		$(this).ajaxSubmit({
			error: function(xhr) {
				$("#status").empty().text("Error uploading file")
			},
			success: function(res) {
				console.log(res);
				$("#status").empty().text(res.msg);
				$("#cropImage").attr("src",res.path);
				createCropper();
			}
		});
	});
	
	function createCropper(){
		var image = document.getElementById('cropImage');
		var cropper = new Cropper(image, {
		aspectRatio: 182 / 268,
		viewMode: 1,
		dragMode: 'move',
		preview: document.getElementById('cropPreview'),
		crop: function(e) {
			console.log(e.detail.x);
			console.log(e.detail.y);
			console.log(e.detail.width);
			console.log(e.detail.height);
			console.log(e.detail.rotate);
			console.log(e.detail.scaleX);
			console.log(e.detail.scaleY);
			}
		});
		$("button#cropButton").click(function(){
			$("div#editmovie div#cropContainer").toggle();
		});
	}
	
});