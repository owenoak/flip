define(function(require, exports, module) {
  var View      = require('famous/core/View');
  var Surface   = require('famous/core/Surface');
  var Modifier  = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');

  var PageView = function(){
    View.apply(this, arguments);

    this._opacity = 0;

    _createBackground.call(this);
    _createHeader.call(this);
    _createStatusImage.call(this);
    _createTemperatures.call(this);
    _createFooter.call(this);
    _createGradient.call(this);
    _createLocationIcon.call(this);

    _setListeners.call(this);
  };

  PageView.DEFAULT_OPTIONS = {
    status: 'Clear',
    city: 'San Francisco',
    currentTemp: 53,
    tempLow: 52,
    tempHigh: 72,
    cities: null
  };

  PageView.prototype = Object.create(View.prototype);
  PageView.prototype.constructor = PageView;

  var _createBackground = function(){
    this.backgroundSurf = new Surface({
      properties: {
        backgroundColor: 'rgb(240, 170, 30)'
      }
    });
    this._add(this.backgroundSurf);
  };

  var _createGradient = function(){
    this.gradientSurf = new Surface({
      content: '<img width="100%" height="100%" src="img/icons/gradient-mask-4.png"/>'
    });
    this.gradientMod = new Modifier({
      opacity: 0
    });

    this._add(this.gradientMod).add(this.gradientSurf);
  };

  var _createHeader = function(){

    var createStatus = function(){
      this.headerStatusSurf = new Surface({
        content: this.options.status,
        size: [true, true],
        properties: {
          color: 'white',
          fontSize: '26px'
        }
      });
      this.headerStatusMod = new Modifier({
        origin: [0, 0],
        transform: Transform.translate(20, 10, 0)
      });

      this._add(this.headerStatusMod).add(this.headerStatusSurf);
    };

    var createLocation = function(){
      this.headerLocationSurf = new Surface({
        content: this.options.city,
        size: [true, true],
        properties: {
          color: 'white',
          fontSize: '15px'
        }
      });
      this.headerLocationMod = new Modifier({
        origin: [0, 0],
        transform: Transform.translate(20, 41, 0)
      });
      this._add(this.headerLocationMod).add(this.headerLocationSurf);
    };

    createStatus.call(this);
    createLocation.call(this);
  };

  var _createStatusImage = function(){
    var statusImageSurf = new Surface({
      content: '<img height=' + Math.floor(window.innerHeight / 3) + ' src="img/icons/sunny-icon.png"/>'
    });
    var statusImageMod = new Modifier({
      size: [Math.floor(window.innerHeight / 3), Math.floor(window.innerHeight / 3)],
      origin: [.5, .2]
    });
    this._add(statusImageMod).add(statusImageSurf);
  };

  var _createLocationIcon = function(){
    this.locIconSurf = new Surface({
      content: '<img width=35 src="img/icons/location-icon.png"/>'
    });

    this.locIconMod = new Modifier({
      size: [35, 35],
      origin: [0, .5],
      transform: Transform.translate(10, 0, 0)
    });

    this._add(this.locIconMod).add(this.locIconSurf);
  };

  var _createTemperatures = function(){

    var createCurrentTemp = function(){
      this.currentTempSurf = new Surface({
        size:[window.innerWidth, Math.floor(window.innerHeight / 5)],
        content:this.options.currentTemp,
        properties: {
          fontSize: Math.floor(window.innerHeight / 5) + 'px',
          textAlign: 'center'
        }
      });
      this.currentTempMod = new Modifier({
        size: [window.innerWidth, Math.floor(window.innerHeight / 5)],
        origin: [0.5, 0.65]
      });

      this._add(this.currentTempMod).add(this.currentTempSurf);
    };

    var createHighLowTemp = function(){
      var tempHighLowSurf = new Surface({
        size: [window.innerWidth, Math.floor(window.innerHeight / 7)],
        content: this.options.tempHigh + ' / ' + this.options.tempLow,
        properties: {
          fontSize: Math.floor(window.innerHeight / 9) + 'px',
          textAlign: 'center'
        }
      });
      var tempHighLowMod = new Modifier({
        origin: [.5, .85]
      });
      this._add(tempHighLowMod).add(tempHighLowSurf);
    };

    createCurrentTemp.call(this);
    createHighLowTemp.call(this);
  };

  var _createFooter = function(){
    var settingIconSurf = new Surface({
      content: '<img width=40 src="img/icons/settings-icon.png"/>'
    });
    var settingIconMod = new Modifier({
      origin: [0, 1],
      size: [40, 40],
      transform: Transform.translate(10, -5, 0)
    });
    this._add(settingIconMod).add(settingIconSurf);
  };

  var _setListeners = function(){
    this.locIconSurf.on('touchstart', function(){
      this.locIconMod.setOpacity(0.5);
    }.bind(this));

    this.locIconSurf.on('click', function(){
      this.locIconMod.setOpacity(1);
      this._eventOutput.emit('LocationClick');
    }.bind(this));
  };

  PageView.prototype.toggleGradient = function(){  
    this._opacity = this._opacity ? 0 : 1;
    this.gradientMod.setOpacity(
      this._opacity,
      {duration:600}
    );
  };

  PageView.prototype.setCurrentTemp = function(newTemp){
    this.currentTempSurf.setContent(newTemp);
  };

  module.exports = PageView;
});