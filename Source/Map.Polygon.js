/*
---

name: Map.Polygon

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Polygon]

...
*/

Map.Polygon = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#PolygonOptions
	},
	
	subObjectMapping: {
		'this.polygonObj': {
			functions: ['getPath', 'getPaths', 'setOptions'],
			properties: ['map'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseUp', 'rightclick']
		}
	},

	polygonObj: null,

	initialize: function (paths, map, options) {
		this.setOptions(options);
		this.options.paths = typeOf(paths) === 'array' ? paths.toLatLng() : paths;
		this.options.map = map;
		
		this.polygonObj = new google.maps.Polygon(this.options);
		this.mapToSubObject();
	},
	
	hide: function() {
		this.setMap(null);
	},

	show: function() {
		this.setMap(this.options.map);
	},

	toggle: function() {
		if (!!this.getMap()) {
			this.hide();
		}	else {
			this.show();
		}
	},

	destroy: function() {
		this.setMap(null);
		this.polygonObj = null;
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setPath: function(path) {
		var path = typeOf(path) === 'array' ? path.toLatLng() : path;
		this.polygonObj.setPath(path);
	},
	
	setPaths: function(paths) {
		var paths = typeOf(paths) === 'array' ? paths.toLatLng() : paths;
		this.polygonObj.setPaths(paths);
	}

});

Map.implement({
	
	createPolygon: function(paths, options) {
		return new Map.Polygon(paths, this.mapObj, options);
	}

});