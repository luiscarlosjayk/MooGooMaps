/*
---

name: Map.Circle

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Circle]

...
*/

Map.Circle = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#CircleOptions
	},
	
	subObjectMapping: {
		'this.circleObj': {
			functions: ['getBounds', 'getCenter', 'setOptions'],
			properties: ['map', 'radius'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick']
		}
	},

	circleObj: null,

	initialize: function (center, radius, map, options) {
		this.setOptions(options);

		this.options.center = typeOf(center) === 'array' ? center.toLatLng() : center;
		this.options.map = map;
		this.options.radius = radius;
		
		this.circleObj = new google.maps.Circle(this.options);
		
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
		this.circleObj = null;
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setCenter: function(center) {
		var center = typeOf(center) === 'array' ? center.toLatLng() : center;
		this.circleObj.setCenter(center);
	}

});

Map.implement({
	
	createCircle: function(center, radius, options) {
		return new Map.Circle(center, radius, this.mapObj, options);
	}

});