/*
* helveticons.ch
* eddit.com/shop
* glyphish.com
* pictos
*
* */

 /*jslint white: false, onevar: true, browser: true, devel: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true, laxbreak: true */
/*global jQuery, $, Raphael */

function Timeline(domID, width, height, releases) {
  if ( !(this instanceof arguments.callee) ) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.shieldPath = "M-13.497-13.812C-1.827-13.812,0-18.411,0-18.411s1.781,4.599,13.497,4.599V5.046C13.497,12.5,0,18.411,0,18.411 S-13.497,12.5-13.497,5.046V-13.812z";

  self.init = function() {
    self.paper = Raphael(domID, width, height);
    self.dotRadius = 26;
    
    self.parseDates();
    self.draw();
  };
  
  self.parseDates = function() {
    self.parsedReleases = [];
    
    $(releases).each(function(i, release) {
      var epochSeconds = Date.parse(release.date)
        , parsedDate = new Date(epochSeconds);
                            
      self.parsedReleases.push({date:    parsedDate
                              , version: release.version});
    });
    
    self.startTime = self.parsedReleases[0].date.getTime();
    var endTime    = $(self.parsedReleases).last()[0].date.getTime();
    self.timeSpan  = endTime - self.startTime;
  };
  
  self.draw = function() {
    self.plotArray(self.parsedReleases, self.drawDotAndLabel);
    
    self.plotArray([
        {date: (new Date(2005, 0, 1)), version: "2005"}
      , {date: (new Date(2006, 0, 1)), version: "2006"}
      , {date: (new Date(2007, 0, 1)), version: "2007"}
      , {date: (new Date(2008, 0, 1)), version: "2008"}
      , {date: (new Date(2009, 0, 1)), version: "2009"}
      , {date: (new Date(2010, 0, 1)), version: "2010"}
    ], self.drawYear);
  };
  
  self.plotArray = function(theArray, drawingCallback) {
    $(theArray).each(function(i, release) {
      var xOffset = 0
        , timeOffset = release.date.getTime() - self.startTime
        , timeRatio  = timeOffset / self.timeSpan
        , graphWidth = self.paper.width - self.dotRadius * 2;
      xOffset = graphWidth * timeRatio + self.dotRadius;
      drawingCallback(release, xOffset);
    });
  };
  
  self.drawDotAndLabel = function (release, xOffset) {
    var dot, label, scale = 1.0, hoverFunc, hideFunc;
    dot = self.paper.path(self.shieldPath);
      //here is different
    dot.translate(xOffset, self.dotRadius);
    dot.attr({
        'stroke-width': 0
      , 'fill':         '#cccccc'
      , 'fill-opacity': 1.0
    });
        
    label = self.paper.text(xOffset, self.dotRadius, release.version);
    label.attr({
        'fill': '#ffffff'
      , 'font-size': 14
      , 'font-family': "'League Gothic', 'Futura-CondensedMedium', 'Gill Sans MT Condensed', 'Arial Narrow', sans-serif"
    });
    label.toBack();
    dot.toBack();
    
    if (release.version.match(/^\d\.0/)) {
      scale = 1.3;
      dot.attr({
          'fill': '#d92027'
        , r: self.dotRadius
      });
      dot.scale(scale);
      dot.toFront();
      label.attr({
        'font-size': 20
      });
      label.toFront();
    }
        
    hoverFunc = function() {
      dot.animate({scale: 1.6}, 1000, 'bounce');
    };
    hideFunc = function() {
      dot.animate({scale: scale}, 1000, 'bounce');      
    };
    $(dot.node).hover(hoverFunc, hideFunc);
    $(label.node).hover(hoverFunc, hideFunc);
  };
    
  self.drawYear = function (release, xOffset) {
    var label;
    label = self.paper.text( xOffset
                           , (self.dotRadius * 2) + 10
                           , release.version);
    label.attr({
        'fill': '#000000'
      , 'fill-opacity': 0.5
      , 'font-size': 10
      , 'font-family': 'sans-serif'
    });
  };
    
  self.init();
}

var timeline;
jQuery(function () {

  timeline = new Timeline('timeline', 940, 81, [
      {date:"June 25, 2004",     version:"0.5"}
    , {date:"December 13, 2005", version:"1.0.0"}
    , {date:"March 28, 2006",    version:"1.1.0"}
    , {date:"January 18, 2007",  version:"1.2.0"}
    , {date:"December 7, 2007",  version:"2.0.0"}
    , {date:"May 31, 2008",      version:"2.1.0"}
    , {date:"November 21, 2008", version:"2.2.2"}
    , {date:"March 15, 2009",    version:"2.3.2"}
    , {date:"November 26, 2009", version:"2.3.5"}
    , {date:"July 26, 2010",     version:"3 RC1"}
    , {date:"August 30, 2010",   version:"3.0"}
  ]);

  $('#timeline').css({
    'width': timeline.paper.width
  });
});


