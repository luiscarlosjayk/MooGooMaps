/*
---

name: Map.GroundOverlay

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.GroundOverlay]

...
*/

Map.GroundOverlay = new Class({
	
	Implements: [Options, Events, SubObjectMapping],
	
	options: {
		// use all options from http://code.google.com/intl/en/apis/maps/documentation/javascript/reference.html#GroundOverlayOptions
	},
	
	subObjectMapping: {
		'this.groundOverlayObj' : {
			functions: ['getBounds', 'getUrl'],
			properties: ['map'],
			eventOptions: {instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true},
			events: ['click']
		}
	},
	
	groundOverlayObj: null,
	
	initialize: function(url, bounds, map, options) {
		this.setOptions(options);
		this.options.bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.options.map = map;
		
		this.groundOverlayObj = new google.maps.GroundOverlay(url, bounds, this.options);
		this.mapToSubObject();
	},
	
	hide: function () {
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
		this.groundOverlayObj = null;
	}
	
});

Map.implement({
	
	createGroundOverlay: function(url, bounds, options) {
		return new Map.GroundOverlay(url, bounds, this.mapObj, options);
	}
	
});