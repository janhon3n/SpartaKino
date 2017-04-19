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





/* Hall Editor OMG so good*/
function HallEditor(el, rows, cols, hallId, maxwidth) {
	this.el = el;
	this.hallId = hallId;
	this.maxwidth = maxwidth;
	this.datasave;

	this.setSize = function (rows, cols) {
		var maxBoxSize = 40;
		this.rows = rows;
		this.cols = cols;
		if (this.cols * maxBoxSize > this.maxwidth) {
			this.boxSize = this.maxwidth / this.cols;
		} else {
			this.boxSize = maxBoxSize;
		}

		this.width = this.cols * this.boxSize;
		this.height = this.rows * this.boxSize;
	}
	this.setSize(rows, cols);

	this.el.html('<div class="editorwrap"><div class="options"></div><svg width="' + this.width + '" height="' + this.height + '"></svg></div>');
	this.svg = el.find('svg');
	this.options = el.find('div.options');

	this.currentElement = 'chair';

	this.updateSVGSize = function () {
		var svgElements = this.getData().svgElements;
		this.svg.attr("width", this.width).attr("height", this.height);
		this.createSVGHtml(svgElements);
		this.createSVGJavascript();
	}

	this.addElementToBox = function (box, elname, rotation) {
		box.attr("svgelement", elname);
		box.attr("rotation", rotation);
		box.find("svg.element").html('<image x="0" y="0" width="100%" height="100%"'
			 + 'style="transform-origin:50% 50%;transform:rotate(' + rotation + 'deg);"'
			 + 'xlink:href="/public/img/svg/' + elname + '.svg" />');
	}
	
	/* HTML Creating */
	this.createOptionsHtml = function () {
		var optionshtml = '<div class="svgSizeEditor">'
			 + '<div>Colums: <input class="cols" value="' + this.cols + '" type="number" min="4" max="100"></div>'
			 + '<div>Rows: <input class="rows" value="' + this.rows + '" type="number" min="4" max="100"></div>'
			 + '</div>'
			 + '<div class="svgelementChooser">'
			 + '<div class="svgelement" svgelement="chair" svgRotate="0" current="true"><img x="0" y="0" width="100%" height="100%" src="/public/img/svg/chair.svg"/></div>'
			 + '<div class="svgelement" svgelement="wheelchair" svgRotate="0"><img x="0" y="0" width="100%" height="100%" src="/public/img/svg/wheelchair.svg"/></div>'
			 + '<div class="svgelement" svgelement="door" svgRotate="0"><img src="/public/img/svg/door.svg" /></div>'
			 + '<div class="svgelement" svgelement="screen" svgRotate="0"><img src="/public/img/svg/screen.svg" /></div>'
			 + '<div class="svgelement" svgelement="null" svgRotate="0"><img src="/public/img/svg/eraser.svg" /></div>'
			 + '<div class="rotate"><img src="/public/img/svg/rotate.svg" /></div>'
			 + '</div>';
		this.options.html(optionshtml);
	}

	this.createSVGHtml = function (svgElements) {
		var self = this;
		var svghtml = '';
		for (var x = 0; x < this.cols; x++) {
			for (var y = 0; y < this.rows; y++) {
				var xpos = x * this.boxSize;
				var ypos = y * this.boxSize;
				svghtml += '<svg class="box" col="' + x + '" row="' + y + '" x=' + xpos + ' y=' + ypos + ' width=' + this.boxSize + ' height=' + this.boxSize + '>'
				 + '<svg class="element" width="100%" height="100%"></svg>'
				 + '<rect class="boxrect" x=0 y=0 width="100%" height="100%"/></svg>';
			}
		}
		this.svg.html(svghtml);

		if (svgElements) {
			svgElements.forEach(function (svgElement) {
				if(svgElement.col < self.cols && svgElement.row < self.rows){
					self.addElementToBox(self.svg.find('svg.box[col="' + svgElement.col + '"][row="' + svgElement.row + '"]'), svgElement.name, svgElement.rotation);
				}
			});
		}
	}

	/* Javascript creation */
	this.createSVGJavascript = function () {
		var self = this;
		this.svg.find("svg.box").click(function () {
			if ($(this).attr("svgelement") == self.currentElement || self.currentElement == "null") {
				$(this).attr("svgelement", "null");
				$(this).find("svg.element").html('');
			} else {
				var rotation = Number(self.options.find('div.svgelementChooser div.svgelement[current="true"]').attr("svgRotate"));
				self.addElementToBox($(this), self.currentElement, rotation);
			}
		});
	}
	this.createOptionsJavascript = function () {
		var self = this;
		this.options.find('div.svgSizeEditor input[type="number"]').change(function () {
			var c = Number(self.options.find('div.svgSizeEditor input.cols').val());
			var r = Number(self.options.find('div.svgSizeEditor input.rows').val());
			self.setSize(r, c);
			console.log(r);
			console.log(c);
			self.updateSVGSize();
		});

		this.options.find("div.svgelementChooser div.svgelement").click(function () {
			$(this).parent().find("div").attr("current", "false");
			self.currentElement = $(this).attr("svgelement");
			$(this).attr("current", "true");
		});

		this.options.find('div.svgelementChooser div.rotate').click(function () {
			var currentRotate = Number(self.el.find('div.options div.svgelementChooser div.svgelement[current="true"]').attr("svgRotate"));
			currentRotate = (currentRotate + 90) % 360;
			self.options.find('div.svgelementChooser div.svgelement[current="true"]').attr("svgRotate", currentRotate)
				.css("transform", "rotate(" + currentRotate + "deg)");
		});

		this.el.find("button.saveButton").click(function () {
			console.log(self.getData());
		});
	}

	/* Function to turn dom into data */
	this.getData = function () {
		var data = {
			rows: this.rows,
			cols: this.cols,
			svgElements: []
		};

		var seats = 0;
		this.svg.find('svg.box[svgelement]').each(function () {
			if ($(this).attr("svgelement") && $(this).attr("svgelement") != "null") {
				data.svgElements.push({
					name: $(this).attr("svgelement"),
					col: Number($(this).attr("col")),
					row: Number($(this).attr("row")),
					rotation: Number($(this).attr("rotation"))
				});
			}
			if($(this).attr("svgelement") == "chair"){
				seats++;
			}
		});
		data.seats = seats;
		return data;
	}
}