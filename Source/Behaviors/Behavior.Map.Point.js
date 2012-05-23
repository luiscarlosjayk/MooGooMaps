/*
---
name: Behavior.Map.Point
description: Adds a slide interface (Point instance)
provides: [Behavior.Point]
requires: [Behavior/Behavior, /Map.Point]
script: Behavior.Map.Point.js

...
*/

Behavior.addGlobalFilter('Map.Point', {

	required: ['position'],

	defaults: {
		target: '![data-behavior="Map.PolyLine"]'
	},

	setup: function(element, api) {
		var polyLine = element.getElement(api.getAs(String, 'target')).getBehaviorResult('PolyLine');
		return polyLine.addPoint(api.getAs(Array, 'position'));
	}

});