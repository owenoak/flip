define(function(require, exports, module) {
	// Famo.us includes
	// Cheat and assign global vars for the famo.us bits here so we don't have to load them in each
	var Engine  = require('famous/core/Engine');
	var Utility = require('famous/utilities/Utility');
	var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
	var Surface = require('famous/core/Surface');
	var StateModifier = require('famous/modifiers/StateModifier');

	var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);

	// header/footer layout to add a toolbar
	var layout = new HeaderFooterLayout({
		headerSize:80,
	});
	var HeaderView  = require('HeaderView');
	var header = new HeaderView();
	var headerSizer = new StateModifier({
		origin:[0,0],
		align:[0.05,0.1],
		size : [500,80]
	});

	layout.header.add(headerSizer).add(header);


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
	var bookSizer = new StateModifier({
		origin:[0,0],
		align:[0.5,0.1]
	});
	layout.content.add(book);

	mainContext.add(layout);

});
