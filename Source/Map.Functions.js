/*
---

name: Map.Functions
description: Google Maps with MooTools
license: MIT-style license
authors:
  - Ciul
  - Thomas Allmer

requires: [Google.Maps.Api]
provides: [Map.Functions]

...
*/

/**
 * toArray function for google.maps.LatLng Class.
 * It returns [lat,lng] coordinates into an array.
 */
google.maps.LatLng.implement('toArray', function() {
	return new Array(this.lat(), this.lng());
});

/**
 * toArray function for google.maps.LatLngBounds Class.
 * It returns a pair of arrays for SouthWest and NorthEast lat,lng coordinates respectively, into an array like this [[lat,lng],[lat,lng]].
 */
google.maps.LatLngBounds.implement('toArray', function() {
	return new Array(this.getSouthWest().toArray(), this.getNorthEast().toArray());
});

Array.implement({

	toLatLng: function() {
		if (this.length == 2 && typeOf(this[0]) === 'number' && typeOf(this[1]) === 'number' ) {
			return new google.maps.LatLng(this[0], this[1]);
		}
		for (var i = 0, l = this.length; i < l; i++) {
			if (typeOf(this[i]) === 'array') {
				this[i] = this[i].toLatLng();
			}
		}
		return this;
	},

	toLatLngBounds: function() {
		if (this.length === 2) {
			if (typeOf(this[0]) === 'array') {
				this[0] = this[0].toLatLng();
			}
			if (typeOf(this[1]) === 'array') {
				this[1] = this[1].toLatLng();
			}
			return new google.maps.LatLngBounds(this[0], this[1]);
		}
		return this;
	},

	toSize: function() {
		if (this.length == 2 && typeOf(this[0]) === 'number' && typeOf(this[1]) === 'number' ) {
			return new google.maps.Size(this[0], this[1]);
		}
		return this;
	},

	toPoint: function() {
		if (this.length == 2 && typeOf(this[0]) === 'number' && typeOf(this[1]) === 'number' ) {
			return new google.maps.Point(this[0], this[1]);
		}
		return this;
	},

	distanceTo: function(toPoint) {
		var fromPoint = this.toLatLng(), toPoint = toPoint.toLatLng();
		return google.maps.geometry.spherical.computeDistanceBetween(fromPoint, toPoint);
	},

	equalTo: function(arr){
		if (this.length !== arr.length) {
			return false;
		}
		for (var i = this.length - 1; i >= 0; i--) {
			if (this[i] !== arr[i]) {
				return false;
			}
		}
		return true;
	}

});