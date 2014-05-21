require('famous/polyfills');

var FamousEngine = require('famous/engine');
var Surface = require('famous/surface');
var Modifier = require('famous/modifier');
var Transform = require('famous/transform');
var View = require('famous/view');

var App = require('./app');

var mainCtx = FamousEngine.createContext();
mainCtx.setPerspective(1000);

var app = new App();

mainCtx.add(app)


