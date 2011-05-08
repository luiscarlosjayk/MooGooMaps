/*
---

name: Map.Opt_InfoMarker

description: Google Maps with MooTools

license: MIT-style license

authors:
- Ciul
- Thomas Allmer

requires: [Map, Map.Marker, Map.InfoWindow]

provides: [Map.Opt_InfoMarker]

...
*/

Map.Opt_InfoMarker = new Class({
	
	Implements: [Options, Events, SubObjectMapping], 
	
	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoMarkerOptions
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		isOpen: false
	},
	
	subObjectMapping: {
		/*'Map.Opt_InfoMarker.infoWindow': {
			functions: ['close', 'setOptions'],
			properties: ['content'],
			events: ['closeclick', 'content_changed', 'domready', 'success']
		},*/
		'this.marker' : {
			functions: ['getPosition', 'setOptions'],
			properties: ['animation', 'clickable', 'cursor', 'draggable', 'flat', 'icon', 'map', 'shadow', 'shape', 'title', 'visible', 'zIndex'],
			events: ['animation_changed', 'click', 'clickable_changed', 'cursor_changed', 'dblclick', 'drag', 'dragend', 'draggable_changed', 'dragstart', 'flat_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'rightclick', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed']
		}
	},
	
	marker: null,
	
	initialize: function(position, map, options) {
		this.setOptions(options);
		
		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		this.map = map;
		if(!this.map.infoWindow) {
			throw('This Class shall be implemented from the Map.createOpt_InfoMarker method and not a different way.');
		}
		
		this.marker = new Map.Marker(position, map, this.options);
		
		this.mapToSubObject();
		this.mapManualEvents();
		
		if(this.options.isOpen === true) {
			this.open();
		}
		
		this.marker.addEvent('click', function() {
			this.open();
		}.bind(this));
		
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	// MVC object is usually a marker.
	open: function(MVCObject) {
		var MVCObject = MVCObject || this.marker.markerObj;
		this.map.infoWindow.setOptions(this.options);
		this.map.infoWindow.open(this.map, MVCObject);
	},
	
	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.map.infoWindow.setPosition(point);
		this.marker.setPosition(point);
	},
	
	// getPosition gives position of marker.
	getPositionInfoWindow: function() {
		this.map.infoWindow.getPosition();
	},

	setZIndexInfoWindow: function(zIndex) {
		this.map.infoWindow.setZIndex(zIndex);
	},
	
	getZIndexInfoWindow: function() {
		return this.map.infoWindow.getZIndex();
	},
	
	mapManualEvents: function() {
		google.maps.event.addListener(this.marker, 'position_changed', function() {
			this.fireEvent('marker_position_changed');
		}.bind(this));
		
		google.maps.event.addListener(this.map.infoWindow, 'position_changed', function() {
			this.fireEvent('infowindow_position_changed');
		}.bind(this));
		google.maps.event.addListener(this.marker, 'zindex_changed', function() {
			this.fireEvent('marker_zindex_changed');
		}.bind(this));
		google.maps.event.addListener(this.map.infoWindow, 'zindex_changed', function() {
			this.fireEvent('infowindow_zindex_changed');
		}.bind(this));
	}
	
});

Map.implement({
	
	createOpt_InfoMarker: function(position, options) {
		this.mapObj.infoWindow = new Map.InfoWindow([0,0]);
		var opt_InfoMarker = new Map.Opt_InfoMarker(position, this.mapObj, options, this);
		this.markers.push(opt_InfoMarker);
		return opt_InfoMarker;
	}
	
});