var halls = [];
var theaterId;

$(document).ready(function () {
	//if theater id set <==> editing an old theater
	if($("div#edittheater form#theaterForm #theaterId").val()){
		theaterId = $("div#edittheater form#theaterForm #theaterId").val();
		console.log(theaterId);
		
		//get halls
		$.getJSON("/api/halls/theater/id/" + theaterId, function(hals){
			console.log(hals);
			hals.forEach(function(h){
				createNewHallDiv(h);
			});
		});
	}

	//Submitting form
	$('form#theaterForm').submit(function(e){
		$("form#theaterForm .status").html('Saving theater...');
	
		//create theater
		var theater = {
			name: $('form#theaterForm input[name="theater[name]"]').val(),
			address: {
				street: $('form#theaterForm input[name="theater[address][street]"').val(),
				city: $('form#theaterForm input[name="theater[address][city]"').val(),
				postcode: $('form#theaterForm input[name="theater[address][postcode]"').val()
			}
		}
		
		// Save theater
		url = '/api/theaters/';
		if(theaterId){
			url = '/api/theaters/id/' + theaterId;
		}
		console.log(url);
		$.post(url, {theater: theater}).done(function(data){
			console.log(data);
			if(data.error){
				$("form#theaterForm .status").html(data.error);
				e.preventDefault();
				return true;
			}
			if(data._id){
				theaterId = data._id;
			}
			
			// Save halls
			$("form#theaterForm .status").html('Saving halls...');
			halls.forEach(function(h){
				var data = h.editor.getData();
				h.editor = undefined;
				h.name = h.element.find('input.hallname').val();
				h.element = undefined;
				h.theater = theaterId;
				
				//create hall element
				h.rows = data.rows;
				h.cols = data.cols;
				h.elements = data.svgElements;
				h.seats = data.seats;
				h.wheelchair_seats = data.wheelchairSeats;
				console.log(h);

				url = '/api/halls/';
				if(h._id){
					url = '/api/halls/id/'+h._id;
					h._id = undefined;
				}
				$.post(url, {hall : h}).done(function(data){
					console.log(data);
					if(data.error){
						$("form#theaterForm .status").html(data.error);
						e.preventDefault();
						return false;
					} else {
						$("form#theaterForm .status").html('Done');
						return true;
					}
				});
			});
		});
	});
	
	

	function createNewHallDiv(hall){
		var $hallElement = $('<div class="hall">'
			+ '<div class="formrow">'
			+ '<label>Hall name:</label>'
			+ '<input class="hallname" type="text" required>'
			+ '</div>'
			+ '<div class="hideable">'
			+ '<h3 class="hidebutton">Editor</h3>'
			+ '<div class="editor hidecontent"></div>'
			+ '<div class="deletebutton">Delete</div>'
			+ '<hr></div>');

		if(hall)
			$hallElement.find('input.hallname').val(hall.name);
		$('form#theaterForm div#halls').append($hallElement);


		if(!hall)
			var editor = new HallEditor($hallElement.find('.editor'), 8, 6, 700);
		else
			var editor = new HallEditor($hallElement.find('.editor'), hall.rows, hall.cols, 700)

		editor.createOptionsHtml();

		if(hall && hall.elements)
			editor.createSVGHtml(hall.elements);
		else
			editor.createSVGHtml();
		
		editor.createOptionsJavascript();
		editor.createSVGJavascript();
		var newHall = {editor: editor, element: $hallElement};
		if(hall)
			newHall._id = hall._id;
		halls.push(newHall);


		//set slidetoggle for editor
		$hallElement.find('.hidebutton').click(function(){
			$hallElement.find('.hidecontent').slideToggle();
		});
		
		//set delete hall button action
		$hallElement.find('.deletebutton').click(function(){
			if(hall){
				$.post('/api/halls/delete/id/'+hall._id, function(data){
					if(data.error){
						console.log(data.error)
					} else {
						$hallElement.remove();
						let index = halls.indexOf(newHall);
						console.log(index);
						if(index !== -1)
							halls.splice(index, 1);
					}
				});
			} else {
				$hallElement.remove();
				let index = halls.indexOf(newHall);
				console.log(index);
				if(index !== -1)
					halls.splice(index, 1);
			}
		});
	}
	
	$('form#theaterForm #addNewHallButton').click(function(){
		createNewHallDiv();
	});
});