/*
---
name: Behavior.Marker
description: Adds a slide interface (Marker instance)
provides: [Behavior.Marker]
requires: [Behavior/Behavior, /Map.Marker, /Map.FullScreenMarker]
script: Behavior.Marker.js

...
*/

Behavior.addGlobalFilter('Marker', {

	require: ['position'],

	defaults: {
		target: '!div [data-behavior="Map"]',
		type: 'Marker',
		visible: true,
		title: '',
	},

	setup: function(element, api) {
		var map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map'),
			options = {
				visible: api.getAs(Boolean, 'visible'),
				title: api.getAs(String, 'title'),
				icon: api.getAs(String, 'icon') ? { url: api.getAs(String, 'icon') } : {}
			}

		switch(api.getAs(String, 'type')) {
			case 'Marker':
				var marker = map.createMarker(api.getAs(Array, 'position'), options);
				break;
			case 'Info':
				var marker = map.createInfoMarker(api.getAs(Array, 'position'), options);
				marker.setContent(element);
				break;
			case 'FullScreen':
				var marker = map.createFullScreenMarker(api.getAs(Array, 'position'), options);
				marker.setContent(element);
				break;
		}

		return marker;
	}

});