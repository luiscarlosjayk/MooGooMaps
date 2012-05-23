/*
---

name: Map.Geocoder

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map]

provides: [Map.Geocoder]

...
*/

Map.Geocoder = new Class({

	Implements: [Options],

	options: {},

	geocoderObj: null,

	callback: function(results, status) {
		alert('pls define your callback, either on geocode or initialize');
	},

	initialize: function (options, callback) {
		this.setOptions(options);

		this.callback = callback || this.callback;
		this.geocoderObj = new google.maps.Geocoder();
	},

	geocode: function(options, callback) {
		var options = options || this.options;
		var callback = callback || this.callback;
		this.geocoderObj.geocode(options, callback);
	},

	search: function(address, callback) {
		this.geocode({address: address}, callback);
	},

	setAddress: function(address) {
		this.options.address = address;
	},

	getAddress: function() {
		return this.options.address;
	},

	setBounds: function(bounds) {
		this.options.bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
	},

	getBounds: function() {
		return this.options.bounds;
	},

	setLanguage: function(language) {
		this.options.language = language;
	},

	getLanguage: function() {
		return this.options.language;
	},

	setLocation: function(point) {
		this.options.location = typeOf(point) === 'array' ? point.toLatLng() : point;
	},

	getLocation: function() {
		return this.options.location;
	},

	setRegion: function(region) {
		this.options.region = region;
	},

	getRegion: function() {
		return this.options.region;
	},

	setCallback: function(callback) {
		this.callback = callback;
	},

	getCallback: function() {
		return this.callback;
	},

	clear: function(clearCallback) {
		this.options = {};
	}

});

Map.implement({

	// psoide singleton
	getGeocoder: function(options, callback) {
		if (this.geocoder) return this.geocoder;

		var defaultCallback = function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				this.fitBounds(results[0].geometry.viewport);
				if (this.searchMarker != null) {
					this.searchMarker.destroy();
				}
				this.searchMarker = this.createMarker(results[0].geometry.location);
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		}.bind(this);

		var callback = callback || defaultCallback;
		return this.geocoder = new Map.Geocoder(options, callback);
	}

});