define(function(require, exports, module) {
  var View        = require('famous/core/View');
  var Surface     = require('famous/core/Surface');
  var Modifier    = require('famous/core/Modifier');
  var Transform   = require('famous/core/Transform');
  var Utility     = require('famous/utilities/Utility');
  var RotatorView = require('views/RotatorView');

  function LoadView() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    View.apply(this, arguments);

    this.rotatorView = new RotatorView({
      content: '<img src="img/icons/cloud-icon-scaled.png" width="' + windowWidth + '">',
      transition: {
        duration: 1000,
        curve: 'linear'
      }
    });

    this.backgroundSurf = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'grey'
      }
    });

    this.visMod = new Modifier({
      opacity: 1
    });

    this.rotatorMod = this.rotatorView.angleMod;
    this.rotatorView = this.rotatorView;
    this.backgroundMod = new Modifier({
      transform: Transform.translate(0,0,-10)
    });

    var node = this._add(this.visMod)
    node.add(this.backgroundMod).add(this.backgroundSurf);
    node.add(this.rotatorMod).add(this.rotatorView);
  }

  LoadView.prototype = Object.create( View.prototype );
  LoadView.prototype.constructor = LoadView;

  LoadView.prototype.show = function(cb) {
    this.visMod.setOpacity(1, {
        duration: 500,
        curve: 'easeOut'
      }, cb);
  };

  LoadView.prototype.hide = function(cb) {
    this.visMod.setOpacity(0, {
        duration: 250,
        curve: 'linear'
      }, cb);
  };

  module.exports = LoadView;
});