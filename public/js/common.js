$(document).ready(function(){
	
	$('.hideable .hidebutton').click(function(){
		$(this).closest('.hideable').find('.hidecontent').slideToggle();
	});
});

function confirmPrompt($el, textt, f1text, f2text, f1, f2){
	if($el.find('.confirmPrompt').length == 1){
		console.log('moi');
		$el.find('.confirmPrompt').slideUp(function(){
			$el.find('.confirmPrompt').remove();
			createNewConfirmPrompt($el, textt, f1text, f2text, f1, f2);
		});
	} else {
		createNewConfirmPrompt($el, textt, f1text, f2text, f1, f2);
	}
}

function redirect(url){
	window.location.href = url;
}

function createNewConfirmPrompt($el, textt, f1text, f2text, f1, f2){
	$el.html('<div class="confirmPrompt">'+textt
	+ '<a class="f1">'+f1text+'</a><a class="f2">'+f2text+'</a></div>');
	//if hidden slide down
	if($el.find('.confirmPrompt:hidden').length == 1){
		$el.find('.confirmPrompt').slideDown();
	}
	$el.find('.confirmPrompt').find('a.f1').click(function(){
		f1(function(){
			$el.find('.confirmPrompt').slideUp(function(){
				$el.find('.confirmPrompt').remove();
			});	
		});
	});
	$el.find('.confirmPrompt').find('a.f2').click(function(){
		f2(function(){
			$el.find('.confirmPrompt').slideUp(function(){
				$el.find('.confirmPrompt').remove();
			});
		});
	});
}

//delete data from database and row from data table
function deleteRow($el, callback){
	var url;
	if(!$el) return;
	var type = $el.attr('type');
	var id = $el.attr(type+'_id');
	if(!type || !id) return;
	url = '/api/' + type + 's/delete/id/'+id;
	console.log(url);
	$.ajax({
		url: url,
		type: 'POST',
		success: function(result) {
			console.log(result);
			if(result.error){
				console.log(result.error);
			} else {
				$el.slideUp(function(){
					$el.remove();
					callback();
				});
			}
		}
	});
}
function setupTableDeletes() {
	$("table td.delete").each(function(){
		if($(this).attr("deleteSet") != "true"){
			$(this).click(function(){
				$el = $(this).closest('tr');
				$confirmEl = $el.closest('.tableContainer').find('div.confirmContainer');
				confirmPrompt($confirmEl, 'Delete ' + $el.attr("type") +' '+ $el.attr("name") + '?', 'Delete', 'Cancel', function(callback){
					deleteRow($el, callback);
				}, function(callback){
					callback();
				});
			});
		}
	$(this).attr("deleteSet", "true");
	});
}

function setupTableSorting(){
	console.log("Setting up table sorting");
	$("table th.sortable").click(function(){
		var index = $(this).index();
		$(this).parentsUntil("table").find("tr").each(function(){
			$(this).attr("sortdata", $(this).find("td").eq(index).text());
		});
		var arrayOfRows = $(this).parentsUntil("table").find("tr:has(td)").toArray();
		if($(this).hasClass("sortasc")){
			$(this).parentsUntil("table").find("th").removeClass("sortasc").removeClass("sortdesc");
			$(this).addClass("sortdesc");
			arrayOfRows.sort(sortBySortdataDesc);			
		} else {
			$(this).parentsUntil("table").find("th").removeClass("sortasc").removeClass("sortdesc");
			$(this).addClass("sortasc");
			arrayOfRows.sort(sortBySortdataAsc);
		}
		for(var i = 0; i < arrayOfRows.length - 1; i++){
			$(arrayOfRows[i]).before($(arrayOfRows[i+1]));
		}
	});
	
}

function sortBySortdataAsc(a,b){
	var aVal = $(a).attr('sortdata');
	var bVal = $(b).attr('sortdata');
	if(moment(aVal, 'DD.MM.YYYY').isValid() && moment(bVal, 'DD.MM.YYYY').isValid()){
		aVal = moment(aVal, 'DD.MM.YYYY');
		bVal = moment(bVal, 'DD.MM.YYYY');
		
		if(aVal.isBefore(bVal)) {
			return -1;
		} else if(aVal.isAfter(bVal)){
			return 1;
		} else {
			return 0;
		}
		
	} else{
		if(!isNaN(aVal) && !isNaN(bVal)) {
			aVal = Number(aVal);
			bVal = Number(bVal);
		}
		
		if(aVal > bVal) {
			return -1;
		} else if(aVal < bVal){
			return 1;
		} else {
			return 0;
		}
	}
}
function sortBySortdataDesc(a,b){
	var aVal = $(a).attr('sortdata');
	var bVal = $(b).attr('sortdata');
	if(moment(aVal, 'DD.MM.YYYY').isValid() && moment(bVal, 'DD.MM.YYYY').isValid()){
		aVal = moment(aVal, 'DD.MM.YYYY');
		bVal = moment(bVal, 'DD.MM.YYYY');
		
		if(aVal.isBefore(bVal)) {
			return 1;
		} else if(aVal.isAfter(bVal)){
			return -1;
		} else {
			return 0;
		}
		
	} else{
		if(!isNaN(aVal) && !isNaN(bVal)) {
			aVal = Number(aVal);
			bVal = Number(bVal);
		}
		
		if(aVal > bVal) {
			return 1;
		} else if(aVal < bVal){
			return -1;
		} else {
			return 0;
		}
	}
}