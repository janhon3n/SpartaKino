/* Seat Picker */
function SeatPicker(el, hall, maxwidth, tickets) {
	this.el = el;
	this.tickets = tickets;
	this.hall = hall;
	this.maxwidth = maxwidth;
	this.boxSize = 20;
	this.width;
	this.height;

	this.setSize = function(rows, cols) {
		var maxBoxSize = 40;
		if (cols * maxBoxSize > this.maxwidth) {
			this.boxSize = this.maxwidth / cols;
		} else {
			this.boxSize = maxBoxSize;
		}

		this.width = cols * this.boxSize;
		this.height = rows * this.boxSize;
	}
	
	this.setSize(hall.rows, hall.cols);
	this.el.html('<svg width="'+this.width+'" height="'+this.height+'" id="seatPickerSvg"></svg>')
	this.svg = this.el.find("svg#seatPickerSvg");
	
	this.updateSVGSize = function() {
		var svgElements = this.getData().svgElements;
		this.svg.attr("width", this.width).attr("height", this.height);
		this.createSVGHtml(svgElements);
		this.createSVGJavascript();
	}
	
	this.addElementToBox = function (box, elname, rotation, reserved) {
		box.attr("svgelement", elname);
		box.attr("rotation", rotation);
		if(elname == "chair" || elname == "wheelchair"){
			if(reserved){
				box.find("svg.element").html('<image x="0" y="0" width="100%" height="100%"'
					+ 'style="transform-origin:50% 50%;transform:rotate(' + rotation + 'deg);"'
					+ 'xlink:href="/public/img/svg/' + elname + '_reserved.svg" />');
			} else {
				box.attr("free", "free");
				box.find("svg.element").html('<image x="0" y="0" width="100%" height="100%"'
					+ 'style="transform-origin:50% 50%;transform:rotate(' + rotation + 'deg);"'
					+ 'xlink:href="/public/img/svg/' + elname + '.svg" />');
			}
		} else {
			box.find("svg.element").html('<image x="0" y="0" width="100%" height="100%"'
				+ 'style="transform-origin:50% 50%;transform:rotate(' + rotation + 'deg);"'
				+ 'xlink:href="/public/img/svg/' + elname + '.svg" />');
		}
	}
	
	this.createSVGHtml = function() {
		var svgElements = hall.elements;
		var self = this;
		var svghtml = '';
		for (var x = 0; x < this.hall.cols; x++) {
			for (var y = 0; y < this.hall.rows; y++) {
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
				if(svgElement.col < self.hall.cols && svgElement.row < self.hall.rows){
					self.addElementToBox(self.svg.find('svg.box[col="' + svgElement.col + '"][row="' + svgElement.row + '"]'), svgElement.name, svgElement.rotation, svgElement.reserved);
				}
			});
		}
	}
	
	this.createJavascript = function(){
		var self = this;
		this.svg.find("svg.box[free='free']").click(function(){
			var elName = $(this).attr("svgelement");
			if($(this).attr("picked") == "picked"){
				//unpick this box
				$(this).attr("picked", "not")
				$(this).find("svg.element image").attr("xlink:href", "/public/img/svg/"+elName+".svg");
			} else {
				//pick this box
				if((elName == "chair" && self.getPickedAmount().normal < self.tickets.normal) || (elName == "wheelchair" && self.getPickedAmount().wheelchair < self.tickets.wheelchair)){
					self.picked = 
					$(this).attr("picked", "picked");
					$(this).find("svg.element image").attr("xlink:href", "/public/img/svg/"+elName+"_picked.svg");
				}
			}
		});
	}
	
	this.getPickedAmount = function(){
		var picked = {};
		picked.normal = this.svg.find("svg.box[picked='picked'][svgelement='chair']").length;
		picked.wheelchair = this.svg.find("svg.box[picked='picked'][svgelement='wheelchair']").length;
		return picked;
	}
	
	this.getPicked = function(){
		var picked = {};
		picked.normal = [];
		picked.wheelchair = [];
		this.svg.find("svg.box[picked='picked'][svgelement='chair']").each(function(i){
			picked.normal.push({col: $(this).attr('col'), row: $(this).attr('row')});
		});
		this.svg.find("svg.box[picked='picked'][svgelement='wheelchair']").each(function(i){
			picked.wheelchair.push({col: $(this).attr('col'), row: $(this).attr('row')});
		});
		return picked;
	}
}