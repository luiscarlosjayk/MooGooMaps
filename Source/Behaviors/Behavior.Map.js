/*
---
name: Behavior.Map
description: Adds a slide interface (Map instance)
provides: [Behavior.Map]
requires: [Behavior/Behavior, Map]
script: Behavior.Map.js

...
*/

Behavior.addGlobalFilter('Map', {

	returns: Map,

	requireAs: {
		center: Array
	},

	defaults: {
		zoom: 12,
		type: 'roadmap' // ['hybrid', 'roadmap', 'satellite', 'terrain']
	},

	setup: function(element, api) {
		var options = {
			zoom: api.getAs(Number, 'zoom'),
			mapTypeId: api.getAs(String, 'type')
		};
		if (api.getAs(String, 'marker-icon')) {
			options.markerOptions = { icon: { url: api.getAs(String, 'marker-icon') } };
		}
		var canvas = element.clone(false);
		canvas.erase('data-behavior');
		canvas.inject(element, 'top');
		return new Map(canvas, api.getAs(Array, 'center'), options);
	}

});