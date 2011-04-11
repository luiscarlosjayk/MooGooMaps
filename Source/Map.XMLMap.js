/*
---

name: Map.XMLMap

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map, Class.XML2Js, Map.*]

provides: [Map.XMLMap]

...
*/

Map.XMLMap = new Class({
	Implements: [Events],
	
	xmlObj: null,
	map: null,
	
	initialize: function(xmlurl, map) {
		this.map = map !== undefined && map !== null && instaceOf(map, Map) ? map : null;
		this.start(xmlurl);
	},
	
	start: function(xmlurl) {
		new XML2Object(xmlurl).addEvent('complete', function(result) {
			this.xmlObj = result.xmlObj;
			// If there isn't a map, create it; otherwise feed an existing map.
			if(!this.map) {
				this.createMap();
			}
			else
			{
				this.feedMap();
			}
			this.fireEvent('complete', [this.map]);
		}.bind(this));
	}.protect(),
	
	
	createMap: function() {
		var mapContainer = this.xmlObj.attributes.container;
		var mapCenter = [this.xmlObj.attributes.lat, this.xmlObj.attributes.lng];
		var mapOptions = Object.filter(this.xmlObj.attributes, function(value, key) { return key !== 'lat' && key !== 'lng' && key !== 'container'; });
		
		this.map = new Map($(mapContainer), mapCenter, mapOptions);
		this.feedMap();
	},
	
	feedMap: function() {
		var markersArray = Array.filter(this.xmlObj.childNodes, function(value) { return value.name.toLowerCase() == 'marker'; });
		var rectanglesArray = Array.filter(this.xmlObj.childNodes, function(value) { return value.name.toLowerCase() == 'rectangle'; });
		
		this.createMarkers(markersArray);
		this.createRectangles(rectanglesArray);
	},
	
	createMarkers: function(markersArray) {
		Array.each(markersArray, function(item, index) {
			var markerPosition = [item.attributes.lat, item.attributes.lng];
			var markerOptions = Object.filter(item.attributes, function(value, key) { return key !== 'lat' && key !== 'lng'; });
			
			if(!!markerOptions.content || !!markerOptions.url) {
				this.map.createInfoMarker(markerPosition, markerOptions);
			}
			else {
				this.map.createMarker(markerPosition, markerOptions);
			}
			
		}, this);
	},
	
	createRectangles: function(rectanglesArray) {
		Array.each(rectanglesArray, function(item, index) {
			var rectangleBounds = [[item.attributes.swlat, item.attributes.swlng], [item.attributes.nelat, item.attributes.nelat]];
			var rectangleOptions = Object.filter(item.attributes, function(value, key) { return key !== 'swlat' && key !== 'swlng' && key !== 'nelat' && key !== 'nelng'; });
			
			this.map.createRectangle(rectangleBounds, rectangleOptions);
			
		}, this);
	}
	
});