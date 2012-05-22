/*
---
name: Behavior.Point
description: Adds a slide interface (Point instance)
provides: [Behavior.Point]
requires: [Behavior/Behavior, /Map.Point]
script: Behavior.Point.js

...
*/

Behavior.addGlobalFilter('Point', {

	required: ['position'],

	defaults: {
		target: '![data-behavior="PolyLine"]'
	},

	setup: function(element, api) {
		var polyLine = element.getElement(api.getAs(String, 'target')).getBehaviorResult('PolyLine');
		return polyLine.addPoint(api.getAs(Array, 'position'));
	}

});