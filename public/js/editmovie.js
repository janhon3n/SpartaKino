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
	
	$('form#movieForm').submit(function(event) {
		if(cropper != undefined){
			var cdata = cropper.getData();
			// Add cropper data to form
			$('<input />').attr('type', 'hidden').attr('name', "cropper[x]")
				.attr('value', cdata.x).appendTo('form#movieForm');
			$('<input />').attr('type', 'hidden').attr('name', "cropper[y]")
				.attr('value', cdata.y).appendTo('form#movieForm');
			$('<input />').attr('type', 'hidden').attr('name', "cropper[width]")
				.attr('value', cdata.width).appendTo('form#movieForm');
			$('<input />').attr('type', 'hidden').attr('name', "cropper[height]")
				.attr('value', cdata.height).appendTo('form#movieForm');
			$('<input />').attr('type', 'hidden').attr('name', "cropper[filename]")
				.attr('value', cropperFilename).appendTo('form#movieForm');
		}
		return true;
	});
	
	var cropperFilename;
	$('form#imageUpload').submit(function(event) {
		event.preventDefault();
		$("#status").empty().text("File is uploading...");
		$(this).ajaxSubmit({
			error: function(xhr) {
				$("#status").empty().text("Error uploading file")
			},
			success: function(res) {
				console.log(res);
				cropperFilename = res.filename;
				$("#status").empty().text(res.msg);
				$("#cropImage").attr("src",res.path);
				createCropper();
			}
		});
	});
	
	var cropper;
	function createCropper(){
		var image = document.getElementById('cropImage');
		cropper = new Cropper(image, {
			aspectRatio: 91 / 134,
			viewMode: 1,
			dragMode: 'move',
			preview: document.getElementById('cropPreview'),
		});

		$("button#cropButton").click(function(){
			$("div#editmovie div#cropContainer").toggle();
		});
	}
	
});