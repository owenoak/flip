
$.fn.setClass = function(classes) {
	this.each(function(index, element) {
		element.className = classes;
	});
}
