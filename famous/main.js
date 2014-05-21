define(function(require, exports, module) {
	// Famo.us includes
	// Cheat and assign global vars for the famo.us bits here so we don't have to load them in each
	var Engine  = require('famous/core/Engine');
	var Utility = require('famous/utilities/Utility');

	var mainContext = Engine.createContext();
    mainContext.setPerspective(5000);

/*
	// Test one page
	var PageView  = require('PageView');
	var page = window.page = new PageView({
		pageNumber	: 0,
		frontUrl 	: "../projects/bebe/may2014/01.jpg",
		backUrl		: "../projects/bebe/may2014/02.jpg"
	});
	mainContext.add(page);
*/
	// an entire book
	var BookView  = require('BookView');
	var book = window.book = new BookView({
		project 	: "bebe/May2014",
		sideCount	: 50
	});
	console.warn(book.sideCount);
	mainContext.add(book);

});
