/*
---

name: Map.InfoWindow

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map, Core/Request.HTML]

provides: [Map.InfoWindow]

...
*/

Map.InfoWindow = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		content: '<div class="loading"><span>loading...</span></div>',
		url: '',
		forceRequest: false,
		onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
			this.setContent(responseHTML);
		}
	},
	
	subObjectMapping: {
		'this.infoWindowObj': {
			functions: ['close', 'getPosition', 'setOptions'],
			properties: ['content', 'zIndex'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed']
		},
		'this.getRequest()': {
			events: ['success']
		}
	},

	infoWindowObj: null,

	initialize: function (position, options) {
		this.setOptions(options);
		
		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		//this.options.pixelOffset = new google.maps.Size(10,10);
		
		this.infoWindowObj = new google.maps.InfoWindow(this.options);
		
		this.mapToSubObject();
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.infoWindowObj.setPosition(point);
	},
	
	// MVC object is usually a marker.
	open: function(map, MVCObject) {
		this.infoWindowObj.open(map, MVCObject);
		if (this.options.url !== '' && (this.getContent() === this.options.content || this.options.forceRequest)) {
			this.setContent(this.options.content);
			this.getRequest({url: this.options.url}).send();
		}
	},
	
	getRequest: function(options) {
		var options = Object.merge(this.options, options);
		return this.request ? this.request.setOptions(options) : this.request = new Request.HTML(options);
	}

});