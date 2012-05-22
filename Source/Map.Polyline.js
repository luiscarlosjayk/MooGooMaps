/*
---

name: Map.PolyLine

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.PolyLine]

...
*/

Map.PolyLine = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#PolylineOptions
	},

	subObjectMapping: {
		'this.polyLineObj': {
			functions: ['setOptions'],
			properties: ['map'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick']
		}
	},

	polyLineObj: null,
	startPoint: false,

	initialize: function (map, path, options) {
		this.setOptions(options);
		this.map = map;
		this.options.map = map.mapObj;
		if (path) {
			this.init(path, map);
		}
	},

	init: function(path) {
		this.options.path = typeOf(path) === 'array' ? path.toLatLng() : path;
		this.polyLineObj = new google.maps.Polyline(this.options);
		this.mapToSubObject();
	},

	// Adds one element to the end of the array and returns the new length of the array.
	addPoint: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point, count = 0;
		if (!this.startPoint) {
			this.startPoint = point;
		} else {
			if (!this.polyLineObj) {
				this.init([this.startPoint, point], this.options);
				count = 2;
			} else {
				count = this.polyLineObj.getPath().push(point);
			}
			this.fireEvent('addPoint', this.getLastPoint());
		}
		return count;
	},

	getEncodedPath: function(path) {
		var path = path || this.polyLineObj.getPath();
		return google.maps.geometry.encoding.encodePath(path);
	},

	decodePath: function(path) {
		return this.getPath(google.maps.geometry.encoding.decodePath(path));
	},

	setEncodedPath: function(path) {
		var path = path || this.polyLineObj.getPath();
		this.setPath(this.decodePath(path));
	},

	// Inserts an element at the specified index.
	insertPointAt: function(index, point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.polyLineObj.getPath().insertAt(index, point);
	},

	// Removes the last element of the array and returns that element.
	removeLastPoint: function() {
		return this.polyLineObj.getPath().pop();
	},

	setLastPoint: function(point) {
		this.setPointAt(this.getLength()-1, point);
	},

	getLastPoint: function() {
		return this.getPointAt(this.getLength()-1);
	},

	// Returns the number of elements in this array.
	getLength: function() {
		return this.polyLineObj ? this.polyLineObj.getPath().getLength() : this.startPoint ? 1 : 0;
	},

	// Removes an element from the specified index.
	removePointAt: function(index) {
		this.polyLineObj.getPath().removeAt(index); 
	},

	// Sets an element at the specified index.
	setPointAt: function(index, point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		return this.polyLineObj ? this.polyLineObj.getPath().setAt(index, point) : false;
	},

	// Get an element at the specified index.
	getPointAt: function(index) {
		var point = this.polyLineObj.getPath().getAt(index);
		return [point.lat(), point.lng()];
	},

	// Clears the polyLine path.
	clearPath: function() {
		this.setPath([]);
	},

	optimize: function(grain, givenPath) {
		var path = givenPath || this.getPath(),
			points = [path[0]],
			grain = grain || 50;
		path.each(function(pathPoint) {
			if (points.getLast().distanceTo(pathPoint) > grain) {
				points.push(pathPoint);
			}
		});
		return givenPath ? points : this.setPath(points);
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
		this.polyLineObj = null;
	},

	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/

	setPath: function(path) {
		var path = typeOf(path) === 'array' ? path.toLatLng() : path;
		if (this.polyLineObj) {
			this.polyLineObj.setPath(path);
		} else {
			this.init(path);
		}
	},

	getPath: function(path) {
		var arrayPath = [], path = path || this.polyLineObj.getPath().getArray();
		Object.each(path, function(point) {
			arrayPath.push([point.lat(), point.lng()]);
		});
		return arrayPath;
	}

});

Map.implement({

	polyLines: [],

	createPolyLine: function(options, path) {
		var polyLine = new Map.PolyLine(this, path, options);
		this.addPolyLine(polyLine);
		return polyLine;
	},

	getPolyLines: function() {
		return this.polyLines;
	},

	setPolyLines: function(polyLines) {
		this.polyLines = polyLines;
	},

	addPolyLine: function(polyLine) {
		return this.polyLines.push(polyLine);
	}

});