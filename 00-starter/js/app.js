
/*jslint white: false, onevar: true, browser: true, devel: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true */
/*global jQuery, $, Raphael */

function Timeline(domID, width, height, releases){
    //will be called by new argument
    if( !(this instanceof arguments.callee)){
        return new arguments.callee(arguments);
    }
    var self = this;
    //only need on Raphael instance (drawing space)
    self.init = function(){
        self.paper = Raphael(domID, width, height);
        self.dotRadius = 26;
        self.parseDates();
    };

    self.parseDates = function(){
        self.parsedReleases = [];

        $(releases).each(function(i, release){
            var epochSeconds = Date..parse(release.date)
                ,parsedDate = new Date(epochSeconds);

            self.parsedReleases.push({date: parsedDate, version: release.version})
        });
    };

    self.drawDotAndLabel = function(release, xOffset){
        //id
        var dot, label;
        // y = dotRadius
        dot = self.paper.circle(xOffset, self.dotRadius, self.dotRadius);
        dot.attr({
            'stroke-width': 0,
            'fill': '#cccccc',
            'fill-opacity': 1.0
        });

        label = self.paper.text(xOffset, self.dotRadius, release.version);
        label.attr({
             'fill': '#ffffff'
            ,'font-size': 20
            ,'font-family': "'League Gothic', 'Futura-CondensedMedium', 'Arial Narrow', sans-serif"
        });
    };
    //js won't auto init
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
//    var timeline = new Timeline('raphael', 940, 81)
//    timeline.drawDotAndLabel({}, 400)
//    timeline.drawDotAndLabel({version:'123'}, 100)
});


