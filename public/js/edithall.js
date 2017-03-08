$(document).ready(function(){
	var hallEditor = new HallEditor($("div#editor"), 20,20);
	hallEditor.createBoard();
});


class HallEditor {
	constructor(elem, width, height){
		this.elem;
		this.width = width;
		this.height = height;
	}
	
	createBoard(){
		var html = '<div class="he_container">';
		html += '<div class="he_map">';
		for(var y = 0; y < this.height; y++){
			html += '<div class="he_row">';
			for(var x = 0; x < this.width; x++){
				html += '<div class="he_square"></div>';
			}
			html += '</div>';
		}
		html += '</div></div>';
		this.elem.html(html);
	}
}