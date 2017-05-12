/* Hall Editor */
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
	this.createOptionsHtml = function() {
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
		var wheelchairSeats = 0;
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
			if($(this).attr("svgelement") == "wheelchair"){
				wheelchairSeats++;
			}
		});
		data.seats = seats;
		data.wheelchairSeats = wheelchairSeats;
		return data;
	}
}