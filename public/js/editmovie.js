$(document).ready(function(){
	// form stuff
	$("button#addActorButton").click(function(){
		var index = Number($(this).parent().parent().find('div#actorsRow input:last-child').attr("actorindex"));
		index++;
		$("div#actorsRow").append(createActorInput(index));
	});
	$("button#removeActorButton").click(function(){
		$(this).parent().parent().find('div#actorsRow input:last-child').remove();
	});
	
	function createActorInput(ai){
		return '<input type="text" actorindex="'+ai+'" name="movie[actors]['+ai+'][name]">';
	}
	
	
	
	/* image stuff */
	var newImage = false; // variable to tell if new image was posted with ajax
	
	//when submitting the editmovie form add imagefilename and data from cropper
	$('form#movieForm').submit(function(event) {
		
		$('<input />').attr('type', 'hidden').attr('name', "image[filename]")
			.attr('value', $('img#cropImage').attr("imagefile")).appendTo('form#movieForm');
		if(newImage){
			$('<input />').attr('type', 'hidden').attr('name', "image[new]")
				.attr('value', "true").appendTo('form#movieForm');
		}
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
		}
		return true;
	});

	//If users sends new image
	$('form#imageUpload').submit(function(event) {
		event.preventDefault();
		$("#status").empty().text("File is uploading...");
		$(this).ajaxSubmit({
			error: function(xhr) {
				$("#status").empty().text("Error uploading file")
			},
			success: function(res) {
				console.log(res);
				newImage = true;
				$('img#cropImage').attr("imagefile", res.filename)
				$("#status").empty().text(res.msg);
				$("img#cropImage").attr("src",res.path);
				if(!cropper){
					createCropper();
				} else {
					cropper.destroy();
					createCropper();
				}
			}
		});
	});
	
	//cropper.js plugin to handle image cropping gui
	var cropper;
	
	/* create cropper
		1. when page loads if movie being edited has a movie already
		2. else when first new image sent with ajax
	*/
	function createCropper(data){
		if(!data) data = {};
		var image = document.getElementById('cropImage');
		cropper = new Cropper(image, {
			aspectRatio: 91 / 134,
			viewMode: 1,
			data: data,
			dragMode: 'move'
		});
	}
	
	//If edited movie has a image already
	var cropImageEl = $("img#cropImage");
	if(cropImageEl.attr("src")){
		var cropperData = {}
		cropperData.x = Number(cropImageEl.attr("cdatax"));
		cropperData.y = Number(cropImageEl.attr("cdatay"));
		cropperData.width = Number(cropImageEl.attr("cdatawidth"));
		cropperData.height = Number(cropImageEl.attr("cdataheight"));
		console.log(cropperData);
		createCropper(cropperData);
	}
	
});