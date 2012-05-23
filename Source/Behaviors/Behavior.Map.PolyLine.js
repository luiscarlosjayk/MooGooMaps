/*
---
name: Behavior.Map.PolyLine
description: Adds a PolyLine to a Map
provides: [Behavior.Map.PolyLine]
requires: [Behavior/Behavior, /Map.PolyLine, /Map.PolyLine.Animated, /Map.PolyLine.Advanced]
script: Behavior.PolyLine.js

...
*/

Behavior.addGlobalFilter('Map.PolyLine', {

	defaults: {
		target: '!div [data-behavior="Map"]',
		type: 'PolyLineAdvanced',
		color: '#000',
		opacity: 0.7,
		weight: 2
	},

	setup: function(element, api) {
		var animated = api.getAs(Boolean, 'animated'),
			map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map'),
			options = {
				'strokeColor': api.getAs(String, 'color'),
				'strokeOpacity': api.getAs(Number, 'opacity'),
				'strokeWeight': api.getAs(Number, 'weight'),
				'markerOptions': api.getAs(String, 'icon') ? { icon: { url: api.getAs(String, 'icon') } } : {}
			};

		switch(api.getAs(String, 'type')) {
			case 'PolyLine':
				var polyLine = map.createPolyLine(options);
				break;
			case 'PolyLineAdvanced':
				var polyLine = map.createPolyLineAdvanced(options);
				break;
			case 'PolyLineAnimated':
				var polyLine = map.createPolyLineAnimated(options);
				polyLine.fx.addEvent('setPoint', function(lat, lng) {
					var point = [lat, lng];
					map.panTo(point);
				});
				break;
		}

		if (api.getAs(String, 'encodedpath')) {
			polyLine.setEncodedPath(api.getAs(String, 'encodedpath'));
		}

		return polyLine;
	}

});