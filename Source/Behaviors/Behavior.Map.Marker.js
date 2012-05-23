/*
---
name: Behavior.Map.Marker
description: Adds an Marker to a Map
provides: [Behavior.Map.Marker]
requires: [Behavior/Behavior, Behavior.Map, Map.InfoMarker, Map.FullScreenMarker]
script: Behavior.Map.Marker.js

...
*/

Behavior.addGlobalFilter('Map.Marker', {

	requireAs: {
		position: Array
	},

	defaults: {
		target: '!div [data-behavior="Map"]',
		type: 'InfoMarker',
		visible: true,
		title: ''
	},

	setup: function(element, api) {
		var map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map'),
			marker,	options = {
				visible: api.getAs(Boolean, 'visible'),
				title: api.getAs(String, 'title')
			}
		if (api.getAs(String, 'icon')) {
			options.icon = { url: api.getAs(String, 'icon') };
		}

		switch(api.getAs(String, 'type')) {
			case 'Marker':
				marker = map.createMarker(api.getAs(Array, 'position'), options);
				break;
			case 'InfoMarker':
				marker = map.createInfoMarker(api.getAs(Array, 'position'), options);
				marker.setContent(element);
				break;
			case 'FullScreenMarker':
				marker = map.createFullScreenMarker(api.getAs(Array, 'position'), options);
				marker.setContent(element);
				break;
		}

		return marker;
	}

});