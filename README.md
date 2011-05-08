MooGooMaps
==========

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
			<script type="text/javascript" src="MooGooMaps/Class.SubObjectMapping.js" />
			<!-- <script type="text/javascript" src="MooGooMaps/XML2Js.js" /> --> // If Map will be created from a XML file.
			<script type="text/javascript" src="MooGooMaps/Map.js" /> // This is the one which creates maps.
			<script type="text/javascript" src="MooGooMaps/Map.Extras.js" /> // This adds required features to Map Class.
			<script type="text/javascript" src="MooGooMaps/Map.Marker.js" /> // To create markers in your maps.
			<script type="text/javascript" src="MooGooMaps/Sourcescripts" /> // Here, include the rest of MooGooMaps files you will need for you application.
			
			[... whatever else you have in your document head]
		</head>
		
		<body>
			//and at Document Body, you could have a Div element like this:
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
	File's names are very verbose so you could intuit what are they for.
	
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
		var map = new Map('map_canvas', [10.979,74.807], {zoom: 10});
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

Having Fun with Plugins
-----------------------
	
	The posibilities are inifinite. What do you want to do is up to you and your needs.
	Try the plugins as how they are until now (development but already functional).
	
	To use actual plugins, only include the respective js script file and that's it.
	You will see customizable buttons (through css rules) in the right top corner of the map.
	Don't be afraid and click them!
	
	Plugins:
		- Bounds by Thomas Allmer:
			It creates a rectangle which can be resized through two draggable markers.
			On clicked inside of it, an InfoWindow with the coordinates of the center of the rectangle will pop up.
			
		- Marker Seeker by Ciul:
			It creates a circle which can be resized through a dragganle marker.
			While resizing or dragging the map, it will show those markers inside the circle (search scope)
			and hide those markers outside the circle bounds. It is like a filter glass for markers :P
		- Marker Filter by Ciul:
			It filters markers according to a marker option you set, matched against strings inside an Array.
			These will be show/hide according to checboxed created from the strings in that Array.
			To better understand, let's say markers keep a isType option with values like "restaurant",
			"hotel", "school", "park", else. Then there will be created a checkbox for each one.
			Now, on "hotel" checkbox checked, it displays those markers that match for that.
			It is also, totally customizable through options and CSS styles.