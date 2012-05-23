/*
---

name: Map.FullScreenMarker

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map.Marker]

provides: [Map.FullScreenMarker]

...
*/

Map.FullScreenMarker = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoMarkerOptions
		isOpen: false
	},

	subObjectMapping: {
		'this.marker': {
			functions: ['getPosition', 'setOptions'],
			properties: ['animation', 'clickable', 'cursor', 'draggable', 'flat', 'icon', 'map', 'shadow', 'shape', 'title', 'visible', 'zIndex'],
			events: ['animation_changed', 'click', 'clickable_changed', 'cursor_changed', 'dblclick', 'drag', 'dragend', 'draggable_changed', 'dragstart', 'flat_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'rightclick', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'position_changed', 'zindex_changed']
		}
	},

	infoWindow: null,
	marker: null,

	initialize: function (position, map, options) {
		this.setOptions(options);

		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		this.map = map;

		this.marker = new Map.Marker(position, map, this.options);


		this.mapToSubObject();

		if (this.options.isOpen === true) {
			this.open();
		}

		this.marker.addEvent('click', function() {
			this.open();
		}.bind(this));

		this.build();
	},

	setContent: function(element) {
		this.wrap.grab(element);
		this.fireEvent('content_changed', this.wrap, 1);
	},

	build: function() {
		this.wrap = new Element('div[class="fullScreenWrap"]');
		this.wrap.set('style', 'position: fixed; width: 100%; height: 100%; left: 0; top: 0;');
		this.wrap.setStyle('opacity', 0);
		this.wrap.setStyle('visibility', 'hidden');
		this.wrap.inject(document.body);
	},

	hide: function() {
		this.marker.hide();
	},

	show: function(alsoOpenFullScreenWindow, animation, duration) {
		this.marker.show(animation, duration);
		if (alsoOpenFullScreenWindow === true) {
			this.open();
		}
	},

	destroy: function() {
		this.marker.destroy();
	},

	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/

	open: function() {
		this.wrap.fade(1);
		this.fireEvent('open', this.wrap);
	},

	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.marker.setPosition(point);
	},

	close: function() {
		this.wrap.fade(0);
		this.fireEvent('close', this.wrap);
	}

});

Map.implement({

	createFullScreenMarker: function(position, options) {
		var options = Object.merge(Object.clone(this.options.markerOptions), options);
		var fullScreen = new Map.FullScreenMarker(position, this, options);
		this.addMarker(fullScreen);
		return fullScreen;
	}

});