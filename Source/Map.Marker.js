/*
---

name: Map.Marker

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Marker]

...
*/

Map.Marker = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#MarkerOptions
		visible: true
	},
	
	subObjectMapping: {
		'this.markerObj': {
			functions: ['getPosition', 'setOptions'],
			properties: ['animation', 'clickable', 'cursor', 'draggable', 'flat', 'icon', 'map', 'shadow', 'shape', 'title', 'visible', 'zIndex'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['animation_changed', 'click', 'clickable_changed', 'cursor_changed', 'dblclick', 'drag', 'dragend', 'draggable_changed', 'dragstart', 'flat_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'position_changed', 'rightclick', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed']
		}
	},

	markerObj: null,
	
	initialize: function (position, map, options) {
		this.setOptions(options);
		this.initOptions();
		
		// we can't use position or map with options, as it is needed as a reference and not as a copy like setOptions would create it
		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		this.options.map = map;
		
		this.markerObj = new google.maps.Marker(this.options);
		this.mapToSubObject();
	},
	
	distanceTo: function(endPoint) { // You can pass a [lat, lng] array as well a marker as endPoint
		if(typeOf(endPoint) === 'array' && endPoint.length === 2 && typeOf(endPoint[0]) === 'number' && typeOf(endPoint[1]) === 'number') {
			return Map.geometry.computeDistanceBetween(this.getPosition(), endPoint);
		}
		
		if(instanceOf(endPoint, Map.Marker) ) {
			return Map.geometry.computeDistanceBetween(this.getPosition(), endPoint.getPosition());
		}
		
		return 0;
	},
	
	distanceThrough: function(pointsPath) {
		
		if(typeOf(pointsPath) === 'array') {
			if(pointsPath.every(function(item) {return (typeOf(item) === 'array');}) && pointsPath.flatten().every(function(item) {return (typeOf(item) === 'number');}) ) {
				pointsPath.unshift(this.getPosition().toArray());
				return Map.geometry.computeLength(pointsPath);
			}
			
			if(pointsPath.flatten().every(function(item) {return (instanceOf(item, Map.Marker));}) ) {
				pointsPath.unshift(this);
				pointsPath.each(function(item, index) {this[index] = item.getPosition().toArray()}, pointsPath);
				return Map.geometry.computeLength(pointsPath);
			}
		}
		
		return 0;
	},
	
	initOptions: function() {
		if (typeOf(this.options.icon) === 'object') {
			this.options.icon.size = typeOf(this.options.icon.size) === 'array' ? this.options.icon.size.toSize() : this.options.icon.size;
			this.options.icon.origin = typeOf(this.options.icon.origin) === 'array' ? this.options.icon.origin.toPoint() : this.options.icon.origin;
			this.options.icon.anchor = typeOf(this.options.icon.anchor) === 'array' ? this.options.icon.anchor.toPoint() : this.options.icon.anchor;
			this.options.icon.scaledSize = typeOf(this.options.icon.scaledSize) === 'array' ? this.options.icon.scaledSize.toSize() : this.options.icon.scaledSize;
			this.options.icon = new google.maps.MarkerImage(this.options.icon.url, this.options.icon.size, this.options.icon.origin, this.options.icon.anchor, this.options.icon.scaledSize);
		}
		if (typeOf(this.options.icon) === 'string' && this.options.icon.lenght > 0) {
			this.options.icon = new google.maps.MarkerImage(this.options.icon.url);
		}
		
		if (typeOf(this.options.shadow) === 'object') {
			this.options.shadow.size = typeOf(this.options.shadow.size) === 'array' ? this.options.shadow.size.toSize() : this.options.shadow.size;
			this.options.shadow.origin = typeOf(this.options.shadow.origin) === 'array' ? this.options.shadow.origin.toPoint() : this.options.shadow.origin;
			this.options.shadow.anchor = typeOf(this.options.shadow.anchor) === 'array' ? this.options.shadow.anchor.toPoint() : this.options.shadow.anchor;
			this.options.shadow.scaledSize = typeOf(this.options.shadow.scaledSize) === 'array' ? this.options.shadow.scaledSize.toSize() : this.options.shadow.scaledSize;
			this.options.shadow = new google.maps.MarkerImage(this.options.shadow.url, this.options.shadow.size, this.options.shadow.origin, this.options.shadow.anchor, this.options.shadow.scaledSize);
		}
		if (typeOf(this.options.shadow) === 'string' && this.options.shadow.lenght > 0) {
			this.options.shadow = new google.maps.MarkerImage(this.options.shadow.url);
		}
	},
	
	hide: function() {
		this.setVisible(false);
	},

	show: function() {
		this.setVisible(true);
	},

	toggle: function() {
		if (this.getVisible()) {
			this.hide();
		} else {
			this.show();
		}
	},

	destroy: function() {
		this.setMap(null);
		this.markerObj = null;
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.markerObj.setPosition(point);
	}

});

Map.implement({

	markers: [],
	
	createMarker: function(position, options) {
		var marker = new Map.Marker(position, this.mapObj, options);
		this.markers.push(marker);
		return marker;
	},
	
	getMarkers: function() {
		return this.markers;
	},
	
	setMarkers: function(markers) {
		this.markers = markers;
	},
	
	zoomToMarkers: function(markers, useOnlyVisible) {
		var markers = markers || this.markers, useOnlyVisible = useOnlyVisible || true;
		markers = useOnlyVisible ? markers.filter(function(marker) { return marker.getVisible(); }) : markers;
		if (markers.length > 0) {
			var bounds = [markers[0].getPosition(), markers[0].getPosition()].toLatLngBounds();
			markers.each(function(marker) {
				bounds.extend(marker.getPosition());
			});
			this.fitBounds(bounds);
		}
	}

});