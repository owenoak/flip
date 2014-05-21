define(function(require, exports, module) {
  var Engine         = require('famous/core/Engine');
  var View           = require('famous/core/View');
  var Surface        = require('famous/core/Surface');
  var Modifier       = require('famous/core/Modifier');
  var Transitionable = require('famous/transitions/Transitionable');
  var Transform      = require('famous/core/Transform');

  function RotatorView() {
    View.apply(this, arguments);

    this.centerAxis = new Modifier({
      size: [undefined, undefined],
      origin: [0.5, 0.5]
    });

    this.angleMod = new Modifier();
    this.angleTransition = new Transitionable(0);
    this.bindTransitionable();
    this.setAngle = 0;

    this.contentView = new ContentView({
      content: this.options.content
    });

    this.contentView.pipe(this._eventOutput);

    this._add(this.centerAxis).add(this.contentView);

    this.run = false;
    this.updateAngle();
  }

  RotatorView.prototype = Object.create(View.prototype);
  RotatorView.prototype.constructor = RotatorView;

  RotatorView.prototype.angleReader = function() {
    this.angleMod.setTransform( 
        Transform.multiply( Transform.translate(0,0,25),
        Transform.rotateY( this.angleTransition.get() )) );
  };

  RotatorView.prototype.bindTransitionable = function() {
    Engine.on('prerender', this.angleReader.bind( this ));
  }

  RotatorView.prototype.startSpinner = function() {
    this.run = true;
    this.updateAngle(0.01);
  };

  RotatorView.prototype.stopSpinner = function() {
    this.run = false;
  };

  RotatorView.prototype.updateAngle = function() {
    if (this.setAngle) {
      this.setAngle = 0
      this._eventOutput.emit('revolution');
    } else {
      this.setAngle = 2 * Math.PI;
      this._eventOutput.emit('revolution');
    };

    this.angleTransition.set( this.setAngle, this.options.transition, this.updateAngle.bind(this) );
  };

  RotatorView.DEFAULT_OPTIONS = {
    content: null,
    transition: null
  };

  function ContentView() {
    View.apply(this, arguments);  
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var calculatedHeight = windowWidth/320 

    this.mod = new Modifier({
      size: [undefined, 75],
      origin: [0, 0.5]
    });

    this.surf = new Surface({
      content: this.options.content,
      classes: ['rotator']
    }); 
    this._add(this.mod).add(this.surf);
  }

  ContentView.prototype = Object.create(View.prototype);
  ContentView.prototype.constructor = ContentView;

  ContentView.DEFAULT_OPTIONS = {
    content: null,
    classes: null
  };

  module.exports = RotatorView;
});