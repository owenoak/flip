define(function(require, exports, module) {
  var Surface         = require('famous/core/Surface');
  var Modifier        = require('famous/core/Modifier');
  var Transform       = require('famous/core/Transform');
  var View            = require('famous/core/View');

  var Scrollview = require('famous/views/Scrollview');

  function ListView() {
    View.apply(this, arguments);

    _createList.call(this);
  }

  ListView.prototype = Object.create(View.prototype);
  ListView.prototype.constructor = ListView;

  ListView.DEFAULT_OPTIONS = {
    listItemHeight:77,
    height: null
  };

  function _createList() {
    
    var listSurfaces = [];

    var listScrollview = new Scrollview({
      speedLimit: 2.5,
      edgeGrip: 0.05
    });
    listScrollview.sequenceFrom(listSurfaces);

    var listContents = [
      {subject:'Here',                   type:"PLACE"},
      {subject:'The Design Of Everyday', type:"BOOK"},
      {subject:'The Phantom Tollbooth',  type:"BOOK"},
      {subject:'Reading',                type:"BOOK"},
      {subject:'Rob',                    type:"PERSON"},
      {subject:'Ideaaaah',               type:"IDEA"},
      {subject:'Make a movie',           type:"MOVIE"},
      {subject:'Here',                   type:"PLACE"},
      {subject:'The Design Of Everyday', type:"BOOK"},
      {subject:'The Phantom Tollbooth',  type:"BOOK"},
      {subject:'Rob',                    type:"PERSON"},
      {subject:'Ideaaaah',               type:"IDEA"},
      {subject:'Make a movie',           type:"MOVIE"},
      {subject:'Here',                   type:"PLACE"},
      {subject:'The Design Of Everyday', type:"BOOK"},
      {subject:'The Phantom Tollbooth',  type:"BOOK"},
      {subject:'Reading',                type:"BOOK"},
      {subject:'Rob',                    type:"PERSON"},
      {subject:'Ideaaaah',               type:"IDEA"},
      {subject:'Make a movie',           type:"MOVIE"},
      {subject:'The Design Of Everyday', type:"BOOK"},
      {subject:'The Phantom Tollbooth',  type:"BOOK"},
      {subject:'Reading',                type:"BOOK"},
      {subject:'Rob',                    type:"PERSON"},
      {subject:'Ideaaaah',               type:"IDEA"},
      {subject:'Make a movie',           type:"MOVIE"},
      {subject:'The Design Of Everyday', type:"BOOK"},
      {subject:'The Phantom Tollbooth',  type:"BOOK"},
      {subject:'Reading',                type:"BOOK"},
      {subject:'Rob',                    type:"PERSON"},
      {subject:'Ideaaaah',               type:"IDEA"},
      {subject:'Make a movie',           type:"MOVIE"},
      {subject:'Here',                   type:"PLACE"},
      {subject:'The Design Of Everyday', type:"BOOK"}         
    ];

    var content;
    for(var i = 0; i < listContents.length; i++) {

      content  = '<div class="list-item">'
      content += '<img class="list-icon" width="30" src="img/' + listContents[i].type.toLowerCase() + '-icon.png" />';
      content += '<div class="list-subject">' + listContents[i].subject + '</div>';
      content += '<span class="list-type">' + listContents[i]['type'] + '</span>';
      content += '<img class="list-arrow" width="20" src="img/arrow-icon.png" />';
      content += '</div>';

      var surface = new Surface({
        size: [undefined, this.options.listItemHeight],
        content: content,
        properties: {
          background: 'white',
          color: 'black',
          borderBottom:  '1px solid lightgrey'
        }
      });

      surface.pipe(listScrollview);

      listSurfaces.push(surface);
    }

    var listScrollMod = new Modifier({
      size: [window.innerWidth, window.innerHeight - 44]
    });
    this._add(listScrollMod).add(listScrollview);
  }

  module.exports = ListView;
});