/*
---

name: Map.PolyLine.Advanced

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map.PolyLine]

provides: [Map.PolyLine.Advanced]

...
*/

Map.PolyLine.Advanced = new Class({

	Extends: Map.PolyLine,
	
	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#PolylineOptions
		
	},
	
	// initialize: function (map, path, options) {
		// this.setOptions(options);
		// this.map = map;
		// this.options.map = map.mapObj;
		// if (path) {
			// this.init(path, map);
		// }
	// },
	
	showEditMarkers: function() {
		var path = this.getPath();
		path.each(function(point, i) {
			this.createMarker(point, i);
		}, this);
	},
	
	createMarker: function(position, i) {
		var options = {
				draggable: true,
				raiseOnDrag: false,
				icon: { url: 'typo3conf/ext/mootools_stack/res/Settings/Interface/Map/Default/images/square.png' }
			};
		var marker = new Map.Marker(position, this.map, options);
		
		marker.addEvent('drag', function() {
			this.setPointAt(i, marker.getPosition());
		}.bind(this));
		
		marker.addEvent('dblclick', function() {
			this.removePointAt(i);
		}.bind(this));
	}
	
});

Map.implement({

	createPolyLineAdvanced: function(options, path) {
		var polyLine = new Map.PolyLine.Advanced(this, path, options);
		this.addPolyLine(polyLine);
		return polyLine;
	}

});