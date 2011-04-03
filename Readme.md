MooGooMaps
================

Extends Google Maps Javascript Api to make it easier to implement and expand it's functionality thanks to MooTools magic.

How to use
----------
	
	First you need to follow Google Maps Javascript Api instructions on how to include it.
	You can read about at http://code.google.com/intl/en/apis/maps/documentation/javascript/tutorial.html.
	
	As a simple example, you could use the following lines at Document Head:
	
	<html>
		<head>
			<meta name="viewport" content="initialscale=1.0, userscalable=no" />
			<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false" />
			[... whatever else you have in your document head]
			<script type="text/javascript" src="MooGooMaps/Sourcescripts" /> // Here, include the MooGooMaps files
			you will need for you application
		
		and at Document Body, you could have a Div element like this:
		</head>
		
		<body>
			<style type="text/css">
			  #map_canvas { width: 100%; height: 100%; }
			</style>
			<div id="map_canvas"></div>
			[... whatever else code you have in your document body]
		</body>
	</html>
	
	Do not forget that Class.SubObjectMapping.js, Map.Extras.js and Map.js
	are the minimum script files you would include to create a Map.
	After that you could include only those scripts that you will need for your application.
	
	For example, to create markers in your map, you will need the Map.Marker.js file for that.
	File's names are very verbose so you could intuit why are they for.
	
	For classes extended from Google Maps Api, do not forget to see their documentation at http://code.google.com/intl/en/apis/maps/documentation/javascript/reference.html
	for more details on options and events you can use.
	
How to create a Map
-------------------
	
	var map = Map('map_canvas', [10.979,74.807], {zoom: 10});
	You can use other Google Maps Api, Map class options as well as for other classes.
	
How to create a Marker
----------------------
	
	There are two ways to create most of things, like markers, rectangles, circles and else.
	One is create the object and then set it's map, another is create it directly from the map object.
	
	1-
		var map = Map('map_canvas', [10.979,74.807], {zoom: 10});
		var marker = new Map.Marker([10.979,74.807]);
		marker.setMap(map.getMap());
	
	2-
		var map = Map('map_canvas', [10.979,74.807], {zoom: 10});
		map.createMarker([10.979,74.807]);
	
	Yes. As you can notice, the latter is easier, shorter, and usually more recommended to use.

How to create other stuff
-------------------------
	
	To create Rectangles, Circles, Polygons, Polylines, InfoWindows and else, it is pretty similar to create a Marker.
	Please read classes initialize method to know arguments it requires.
	
What are InfoMarkers?
---------------------
	
	InfoMarkers are a short way to create an InfoWindow attached to a Marker.
	
InfoWindows go AJAX!
--------------------
	
	Yeah! InfoWindows have an url option, so you can dinamically ask for html content to fill it's content.

Easy Setup from a XML file
--------------------------
	
	The Map.XMLMap.js, which is still being written with more functionalities, can create a Map from a simple xml file.
	It allows really fast setup. If you need another location, you just add another Marker node, and that's it :D
	
	XML file example:
		<Map container="map_canvas"
			lat="10.98"
			lng="74.79"
			zoom="10"
			streetViewControl="false"
			>
			<Marker
				title="Marker 1"
				lat="7.6" lng="74"
				content="Marker 1 content"		
			/>
			<Marker
				title="Ajax Marquer"
				lat="7.2" lng="74"
				url="resources/test.html"
			/>
		</Map>