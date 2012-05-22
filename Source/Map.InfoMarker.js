/*
---

name: Map.InfoMarker

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map, Map.Marker, Map.InfoWindow]

provides: [Map.InfoMarker]

...
*/

Map.InfoMarker = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoMarkerOptions
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		isOpen: false
	},
	
	subObjectMapping: {
		'this.infoWindow': {
			functions: ['close', 'setOptions'],
			properties: ['content'],
			events: ['closeclick', 'content_changed', 'domready']
		},
		'this.marker': {
			functions: ['getPosition', 'setOptions'],
			properties: ['animation', 'clickable', 'cursor', 'draggable', 'flat', 'icon', 'map', 'shadow', 'shape', 'title', 'visible', 'zIndex'],
			events: ['animation_changed', 'click', 'clickable_changed', 'cursor_changed', 'dblclick', 'drag', 'dragend', 'draggable_changed', 'dragstart', 'flat_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'rightclick', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed']
		}
	},

	infoWindow: null,
	marker: null,

	initialize: function (position, map, options) {
		this.setOptions(options);
		
		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		this.map = map;
		
		this.infoWindow = new Map.InfoWindow(position, this.options);
		this.marker = new Map.Marker(position, map, this.options);
		
		this.mapToSubObject();
		this.mapManualEvents();
		
		if (this.options.isOpen === true) {
			this.open();
		}
		
		this.marker.addEvent('click', function() {
			this.open();
		}.bind(this));
	},
	
	hide: function() {
		this.marker.hide();
		this.infoWindow.hide();
	},

	show: function(alsoOpenInfoWindow) {
		this.marker.show();
		if (alsoOpenInfoWindow === true) {
			this.open();
		}
	},

	destroy: function() {
		this.marker.destroy();
		this.infoWindow.destroy();
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	// MVC object is usually a marker.
	open: function(MVCObject) {
		var MVCObject = MVCObject || this.marker.markerObj;
		this.infoWindow.open(this.map.mapObj, MVCObject);
	},
	
	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.infoWindow.setPosition(point);
		this.marker.setPosition(point);
	},
	
	// getPosition gives position of marker, should be the same in almost all cases
	getPositionInfoWindow: function() {
		this.infoWindow.getPosition();
	},

	setZIndexInfoWindow: function(zIndex) {
		this.marker.setZIndex(zIndex);
	},
	
	getZIndexInfoWindow: function() {
		return this.infoWindow.getZIndex();
	},
	
	mapManualEvents: function() {
		google.maps.event.addListener(this.marker, 'position_changed', function() {
			this.fireEvent('marker_position_changed');
		}.bind(this));
		google.maps.event.addListener(this.infoWindow, 'position_changed', function() {
			this.fireEvent('infowindow_position_changed');
		}.bind(this));
		google.maps.event.addListener(this.marker, 'zindex_changed', function() {
			this.fireEvent('marker_zindex_changed');
		}.bind(this));
		google.maps.event.addListener(this.infoWindow, 'zindex_changed', function() {
			this.fireEvent('infowindow_zindex_changed');
		}.bind(this));
	}

});

Map.implement({
	
	createInfoMarker: function(position, options) {
		var options = Object.merge(Object.clone(this.options.markerOptions), options);
		var infoMarker = new Map.InfoMarker(position, this, options);
		this.addMarker(infoMarker);
		return infoMarker;
	}

});