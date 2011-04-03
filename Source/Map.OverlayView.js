/*
---

name: Map.OverlayView

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.OverlayView]

google maps possible Map Panes:
	floatPane (Pane 6)
		This pane contains the info window. It is above all map overlays.
	overlayMouseTarget (Pane 5)
		This pane contains transparent elements that receive DOM mouse events for the markers.
		It is above the floatShadow, so that markers in the shadow of the info window can be clickable.
	floatShadow (Pane 4)
		This pane contains the info window shadow. It is above the overlayImage,
		so that markers can be in the shadow of the info window.
	overlayImage (Pane 3)
		This pane contains the marker foreground images.
	overlayShadow (Pane 2)
		This pane contains the marker shadows.
	overlayLayer (Pane 1)
		This pane contains polylines, polygons, ground overlays and tile layer overlays.
	mapPane (Pane 0)
		This pane is the lowes pane and is above the tiles.

---
*/

Map.OverlayView = new Class({
	
	Extends: google.maps.OverlayView,
	Implements: [Events],
	
	wrapper: null,
	el: null,
	bounds: null,
	mapPane: null,
	map: null,
	
	initialize: function(el, bounds, mapPane, map) {
		this.el = typeOf(el) == 'element' ? el : new Element('div', {html: 'OverlayView'});
		this.bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.mapPane = mapPane !== undefined && mapPane !== null && typeOf(mapPane) === 'string' && mapPane != ('floatPane' || 'overlayMouseTarget' || 'floatShadow' || 'overlayImage' || 'overlayShadow' || 'mapPane') ? mapPane : 'overlayLayer';
		this.map = map;
		
		// Implicitly call to onAdd method.
		this.setMap(map);
	},
	
	onAdd: function() {
		
		this.wrapper = new Element('div', {
			styles: {
				position: 'absolute',
				border: 'none',
				borderWidth: '0px',
			}
		});
		
		this.wrapper.grab(this.el);
		
		var panes = this.getPanes();
		var pane = panes[this.mapPane];
		pane.grab(this.wrapper);
		this.fireEvent('onAdd', this.wrapper);
		
	},
	
	onRemove: function() {
		this.wrapper.dispose();
		this.wrapper = null;
	},
	
	draw: function() {
		
		var overlayProjection = this.getProjection();
		
		var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
		var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
		
		this.wrapper.setStyles({
			left:	sw.x + 'px',
			top:	ne.y + 'px',
			width:	Math.abs(ne.x - sw.x) + 'px',
			height:	Math.abs(sw.y - ne.y) + 'px'
		});
		
		this.el.setStyles({
			width:	this.wrapper.getStyle('width'),
			height:	this.wrapper.getStyle('height')
		});
		
		this.fireEvent('onDraw', [this.el, this.wrapper]);
		
	},
	
	hide: function() {
	    if(this.wrapper) {
			this.wrapper.setStyle('visibility', 'hidden');
	    }
	},
	
	show: function() {
	    if(this.wrapper) {
		this.wrapper.setStyle('visibility', 'visible');
	    }
	},
	
	toggle: function() {
	    if(!!this.wrapper) {
			if(this.wrapper.getStyle('visibility') == 'hidden') {
				this.show();
			}
			else
			{
				this.hide();
			}
	    }
	},
	
	toggleDOM: function() {
	    if(this.getMap()) {
			this.map = this.getMap();
			this.setMap(null);
	    }
	    else
	    {
			this.setMap(this.map);
	    }
	}
	
});

Map.implement({
	
	createOverlayView: function(el, bounds, mapPane) {
		return new Map.OverlayView(el, bounds, mapPane, this.mapObj);
	}
	
});