/*
---

name: Map.Rectangle

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Rectangle]

...
*/

Map.Rectangle = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#RectangleOptions
	},
	
	subObjectMapping: {
		'this.rectangleObj': {
			functions: ['getBounds', 'setOptions'],
			properties: ['map'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick']
		}
	},
		
	rectangleObj: null,
	
	initialize: function (bounds, map, options) {
		this.setOptions(options);
		
		// we can't use bounds or map with options, as it is needed as a reference and not as a copy like setOptions would create it
		this.options.bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.options.map = map;
		
		this.rectangleObj = new google.maps.Rectangle(this.options);
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
		this.rectangleObj = null;
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setBounds: function(bounds) {
		var bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.rectangleObj.setBounds(bounds);
	}

});

Map.implement({
	
	createRectangle: function(bounds, options) {
		return new Map.Rectangle(bounds, this.mapObj, options);
	}

});