/*
---

name: Map.Extras

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Core/Class.Extras, GoogleMaps/Base.LatLng]

provides: []

...
*/

/*
--
toArray function for google.maps.LatLng Class.
It returns [lat,lng] coordinates into an array.
--
*/
google.maps.LatLng.implement('toArray', function() {
	return new Array(this.lat(), this.lng());
});

/*
--
toArray function for google.maps.LatLngBounds Class.
It returns a pair of arrays for SouthWest and NorthEast lat,lng coordinates respectively, into an array like this [[lat,lng],[lat,lng]].
--
*/
google.maps.LatLngBounds.implement('toArray', function() {
	return new Array(this.getSouthWest().toArray(), this.getNorthEast().toArray());
});

/*
--

--
*/
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
	
	distanceTo: function(p2) {
		if(this.length === 2 && typeOf(this[0]) === 'number' && typeOf(this[1]) === 'number') {
			if(typeOf(p2) === 'array' && p2.length === 2 && typeOf(p2[0]) === 'number' && typeOf(p2[1]) === 'number' ) {
				return Map.geometry.computeDistanceBetween(this, p2);
			}
		}
		return 0;
	}

});



Map.geometry = {
	
	computeDistanceBetween: function(p1, p2) {
		/*
		--
			* Distance Between Points function
			*
			* Calculates the distance between two latlng locations in meters.
			* @see http://www.movable-type.co.uk/scripts/latlong.html
			*
			* @param {google.maps.LatLng} p1 The first lat lng point.
			* @param {google.maps.LatLng} p2 The second lat lng point.
			* @return {number} The distance between the two points in km.
		--
		*/
		
		if (!p1 || !p2) {
			return 0;
		}
		
		p1 = typeOf(p1) === 'array' ? p1.toLatLng() : p1;
		p2 = typeOf(p2) === 'array' ? p2.toLatLng() : p2;
		
		var R = 6378137; // Radius of the Earth in meters.
		var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
		var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d;
	},
	
	computeLength: function(path) {
		if(path.length < 2) {return 0;}
		
		if(typeOf(path) === 'array' && path.every(function(item) {return typeOf(item) === 'array';}) ) {
			path.each(function(item, index) {path[index] = item.toLatLng();}, path);
		}
		
		var distance = 0;
		for(var i = 1, l = path.length; i<l; i++) {
			var p1 = path[i-1];
			var p2 = path[i];
			
			distance = distance + Map.geometry.computeDistanceBetween(p1, p2);
		}
		
		return distance;
	}

};