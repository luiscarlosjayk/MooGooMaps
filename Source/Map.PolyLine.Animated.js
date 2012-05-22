/*
---

name: Map.PolyLine.Animated

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map.PolyLine]

provides: [Map.PolyLine.Animated]

...
*/

Fx.Point = new Class({

	Extends: Fx,

	initialize: function(element, options){
		this.subject = element;
		this.parent(options);
	},

	set: function(now){
		this.subject.setLastPoint([now[0], now[1]]);
		this.fireEvent('setPoint', [now[0], now[1]]);
		return this;
	},
	
	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},
	
	start: function(from, to){
		if (arguments.length == 1){
			var to = from;
			var from = this.subject.getLastPoint();
		}
		return this.parent(from, to);
	},
	
	hasStarted: function(){
		return (this.frame < this.frames) && !this.isRunning();
	}

});

Map.PolyLine.Animated = new Class({

	Extends: Map.PolyLine,

	options: {
		showNewPoints: false,
		useMarker: true,
		markerOptions: {},
		duration: null,
		speed: 400 // in m/s
	},
	
	points: [],
	
	initialize: function (map, path, options) {
		this.parent(map, path, options);
		this.fx = new Fx.Point(this, { transition: Fx.Transitions.linear });
		this.marker = new Map.Marker([0,0], this.map, this.options.markerOptions);
		if (this.options.useMarker) {
			this.fx.addEvent('setPoint', function(lat, lng) {
				this.marker.setPosition([lat, lng]);
			}.bind(this));
		}
	},
	
	// Adds one element to the end of the array and returns the new length of the array.
	addPoint: function(point, show) {
		var show = show === 'undefined' ? this.options.showNewPoints : !!show;
		return show ? this.parent(point) : this.addVirtualPoint(point);
	},
	
	addVirtualPoint: function(point) {
		var point = typeOf(point) === 'array' ? point : [point.lat(), point.lng()];
		this.points.push(point);
	},
	
	setEncodedPath: function(path, show) {
		var show = show === 'undefined' ? this.options.showNewPoints : !!show;
		return show ? this.parent(path) : this.setVirtualEncodedPath(path);
	},
	
	setVirtualEncodedPath: function(path) {
		this.points = this.decodePath(path);
		console.log(this.points);
	},
	
	start: function(i) {
		if (this.getLength() === this.points.length) return;
		if (!this.polyLineObj || (this.polyLineObj && this.getLength() == 0)) {
			this.addPoint(this.points[0], true);
		}
		var i = i >= 0 ? i : this.getLength()-1 >= 0 ? this.getLength()-1 : 0;
		
		this.addPoint(this.points[i], true);
		var distance = this.points[i].distanceTo(this.points[i+1]);
		var duration = this.options.duration || distance.round(0) / this.options.speed * 1000;
		this.fx.setOptions({
			duration: duration
		});
		this.fx.start(this.points[i+1]).chain(function() {
			if (i+1 < this.points.length-1) {
				this.start(i+1);
			} else {
				this.fireEvent('pointChange', this.points[i+1]);
			}
		}.bind(this));
		
		this.fireEvent('pointChange', this.points[i]);
	},
	
	goTo: function(goTo) {
		if (goTo >= this.points.length || (goTo === this.getLength()-1 && !this.fx.hasStarted())) return;
		var goTo = goTo >= 0 ? goTo : this.points.length-1;
		
		var current = this.getLength()-1 >= 0 ? this.getLength()-1 : 0;
		if (current > 0 && goTo > current) {
			this.setPointAt(current, this.points[current]);
		}
		if (current > 0 && goTo < current) {
			this.clearPath();
			current = 0;
		}
		if (current === 0) {
			this.addPoint(this.points[0], true);
		}
		
		for (var i = current+1; i <= goTo; i++) {
			this.addPoint(this.points[i], true);
		}
		this.fx.resume();
		this.fx.cancel();
	},
	
	pause: function() {
		this.fx.pause();
	},
	
	resume: function() {
		this.fx.resume();
		if (!this.fx.isRunning()) {
			this.start();
		}
	}

});

Map.implement({
	
	polyLinesAnimated: [],
	
	createPolyLineAnimated: function(options, path) {
		var polyLineAnimated = new Map.PolyLine.Animated(this, path, options);
		this.addPolyLineAnimated(polyLineAnimated);
		return polyLineAnimated;
	},
	
	getPolyLinesAnimated: function() {
		return this.polyLinesAnimated;
	},
	
	setPolyLineAnimateds: function(polyLinesAnimated) {
		this.polyLinesAnimated = polyLinesAnimated;
	},
	
	addPolyLineAnimated: function(polyLineAnimated) {
		return this.polyLinesAnimated.push(polyLineAnimated);
	}

});