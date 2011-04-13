/*
---

name: Map

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Core/Class.Extras, SubObjectMapping]

provides: [Map]

...
*/

var Map = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all Options from http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions
		// markerOptions: {},
		mapTypeId: 'roadmap',
		zoom: 6,
		plugins: {}
	},

	subObjectMapping: {
		'this.mapObj': {
			functions: ['getBounds', 'getCenter', 'getDiv', 'getProjection', 'panBy', 'setOptions'],
			properties: ['mapTypeId', 'streetView', 'zoom', 'tilt', 'heading'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['bounds_changed', 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'heading_changed', 'idle', 'maptypeid_changed', 'mousemove', 'mouseout', 'mouseover', 'projection_changed', 'resize', 'rightclick', 'tilesloaded', 'tilt_changed', 'zoom_changed'],
		}
	},

	mapObj: null,
	plugins: {},

	initialize: function (mapContainer, center, options) {
		this.mapContainer = $(mapContainer);
		this.setOptions(options);

		this.options.center = typeOf(center) === 'array' ? center.toLatLng() : center;
		this.mapObj = new google.maps.Map(this.mapContainer, this.options);

		this.mapToSubObject();

		// load registered Plugins
		this.plugins = Object.merge(this.plugins, this.options.plugins);
		Object.each(this.plugins, function(plugin) {
			if (plugin.html && plugin.onClick && !plugin.el) {
				this.addControl(plugin.html, plugin.onClick, plugin.options);
			}
			else if (plugin.el) {
				this.addControlElement(plugin.el, plugin.options);
			}
		}, this);
	},

	addControl: function(html, userFunction, options) {
		var wrapper = new Element('div');
		var klass = options.klass ? options.klass : 'googleButton';
		var el = new Element('div', {
			html: html, 
			'class': klass
		});
		el.addEvent('click', userFunction.bind(this, el));
		wrapper.grab(el);
		this.addControlElement(wrapper, options);
	},

	addControlElement: function(el, options) {
		var pos = (options && options.position) ? options.position : 'TOP_RIGHT';
		var position = google.maps.ControlPosition[pos] || google.maps.ControlPosition.TOP_RIGHT;
		this.mapObj.controls[position].push(el);
	},

	getMap: function() {
		return this.mapObj;
	},

	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/

	fitBounds: function(bounds) {
		var bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.mapObj.fitBounds(bounds);
	},

	panTo: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.mapObj.panTo(point);
	},

	panToBounds: function(bounds) {
		var bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.mapObj.panToBounds(bounds);
	},

	setCenter: function(center) {
		var center = typeOf(center) === 'array' ? center.toLatLng() : center;
		this.mapObj.setCenter(center);
	}

});