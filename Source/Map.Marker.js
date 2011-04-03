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