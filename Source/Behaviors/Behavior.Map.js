/*
---
name: Behavior.Map
description: Adds a slide interface (Map instance)
provides: [Behavior.Map]
requires: [Behavior/Behavior, /Map]
script: Behavior.Map.js

...
*/

Behavior.addGlobalFilter('Map', {

	defaults: {
		position: [48.1695, 16.3299],
		zoom: 12,
		type: 'roadmap' // ['hybrid', 'roadmap', 'satellite', 'terrain']
	},

	setup: function(element, api) {
		return new Map(element, api.getAs(Array, 'position'), {
			zoom: api.getAs(Number, 'zoom'),
			mapTypeId: api.getAs(String, 'type'),
			markerOptions: api.getAs(String, 'icon') ? { icon: { url: api.getAs(String, 'icon') } } : {}
		});
	}

});