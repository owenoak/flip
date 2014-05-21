define(function(require, exports, module) {
  var Engine    = require('famous/core/Engine');
  var View      = require('famous/core/View');
  var Surface   = require('famous/core/Surface');
  var Modifier  = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Utility   = require('famous/utilities/Utility');
  var PageView  = require('views/PageView');
  var FanView   = require('views/FanView');
  var LoadView  = require('views/LoadView');

  var AppView = function(){
    View.apply(this, arguments);
    _createPageView.call(this);
    _createFanView.call(this);
    _createLoadView.call(this);
  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    cities: ['Palo Alto', 'San Francisco', 'Current Location', 'New York', 'Sydney', 'Paris', 'Tokyo', 'Moscow', 'Shanghai']
  };

  var _createPageView = function(){
    this.pageView = new PageView({
      cities: this.options.cities
    });

    this.pageView.on('LocationClick', function() {
      this.pageView.toggleGradient();
      this.fanMod.setTransform(
        Transform.translate(22, 0, 0),
        { duration: 250 },
        this.fanView.open.bind(this.fanView)
      );
    }.bind(this));

    this._add(this.pageView);
  };

  var _createFanView = function(){
    
    this.fanView = new FanView({cities:this.options.cities});
    
    this.fanMod = new Modifier(
      Transform.translate(-window.innerWidth, 0, 0)
    );

    this.fanView.on('FanClosed', function() {
      this.loadView.spinCount = 0;
      this.frontMod.setTransform( Transform.translate(0,0,900) );
      this.loadView.show(
        function(){
          this.pageView.currentCity = this.pageView.currentCity || 'San Francisco';
          this.pageView.headerLocationSurf.setContent(this.pageView.currentCity);
        }.bind(this)
      );

      this.fanMod.setTransform( Transform.translate(-window.innerWidth, 0, 0), {
        duration: 2000,
        curve: 'linear'
      });
    }.bind(this) );

    this.fanView.on('clicked', function(data){
      this.pageView.currentCity = data.data ? data.data.city : this.pageView.currentCity;
      this.pageView.toggleGradient();
    }.bind(this));

    this._add(this.fanMod).add(this.fanView);
  };

  var _createLoadView = function(){
    this.loadView = new LoadView();
    
    this.frontMod = new Modifier({
      transform: Transform.translate(0,0,-1000)
    });

    this.loadView.rotatorView.on('revolution', function() {
      this.loadView.spinCount += 1;
      if (this.loadView.spinCount === 2) {
        this.loadView.hide( function(){
          this.frontMod.setTransform( Transform.translate(0,0,-1000) );
          this.pageView.setCurrentTemp(Math.floor(Math.random()*10 + 55));
        }.bind(this));
      }
    }.bind(this));

    this._add(this.frontMod).add(this.loadView)
  };

  module.exports = AppView;
});