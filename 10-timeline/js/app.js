
/*jslint white: false, onevar: true, browser: true, devel: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true, laxbreak: true */
/*global jQuery, $, Raphael */

function Timeline(domID, width, height, releases) {
  if ( !(this instanceof arguments.callee) ) {
    return new arguments.callee(arguments);
  }

  var self = this;

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
    //last()[0] will open jquery wrapper and get raw obj
    var endTime    = $(self.parsedReleases).last()[0].date.getTime();
    self.timeSpan  = endTime - self.startTime;
  };
  
  self.draw = function() {
    //second arg is callback func
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
        , graphWidth = self.paper.width - self.dotRadius * 2; /* Not to draw out of the boundary:
                                                                center of leftmost circle is (0 + 1r) not 0,
                                                                Also, rightmost coordination is (right - 1r)*/
      console.log("paper width: " + self.paper.width
                + " graph width: " + graphWidth);

      xOffset = graphWidth * timeRatio + self.dotRadius;  /* 1st element is (0 + 26) instead of 0 !! */
      drawingCallback(release, xOffset);
    });
  };
  
  self.drawDotAndLabel = function (release, xOffset) {
    var dot, label;
    // normal dot is 6 pixel small
    dot = self.paper.circle(xOffset, self.dotRadius, self.dotRadius - 6);
    dot.attr({
        'stroke-width': 0
      , 'fill':         '#cccccc'
      , 'fill-opacity': 1.0
    });
    dot.toBack();
    // release version dot is bigger
    if (release.version.match(/^\d\.0/)) {
      dot.attr({
          'fill': '#d92027'
        , r: self.dotRadius
      });
      dot.toFront(); //move main dot over minor dot
    }
    
    label = self.paper.text(xOffset, self.dotRadius, release.version);
    label.attr({
        'fill': '#ffffff'
      , 'font-size': 20
      , 'font-family': "'League Gothic', 'Futura-CondensedMedium', 'Gill Sans MT Condensed', 'Arial Narrow', sans-serif"
    });
  };
    
  self.drawYear = function (release, xOffset) {
    var label;
    label = self.paper.text( xOffset
                           , (self.dotRadius * 2) + 10 /* font-size is 10 */
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


