/*
---

name: Map.Plugin.Bounds

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map.Marker, Map.InfoWindow, Map.Rectangle]

provides: [Map.Plugin.Bounds]

...
*/

Map.implement({

	plugins: {
		bounds: {
			element: null,
			options: {},
			html: 'bounds',
			active: false,
			onClick: function(el) {
				if (!this.plugins.bounds.active) {
					var x = this.getBounds().toSpan().lat();
					var y = this.getBounds().toSpan().lng();
					var point1 = [this.getCenter().lat() - x/8, this.getCenter().lng() - y/8];
					var point2 = [this.getCenter().lat() + x/8, this.getCenter().lng() + y/8];

					if (!this.plugins.bounds.marker1 && !this.plugins.bounds.marker2 && !this.plugins.bounds.rectangle && !this.plugins.bounds.infoWindow) {
						// create
						var options = {
							draggable: true,
							onDrag: function() {
								this.plugins.bounds.rectangle.setBounds( [this.plugins.bounds.marker1.getPosition(), this.plugins.bounds.marker2.getPosition()].toLatLngBounds() );
							}.bind(this),
							onDragstart: function() {
								this.plugins.bounds.infoWindow.close();
							}.bind(this)
						};

						this.plugins.bounds.marker1 = new Map.Marker(point1, this.mapObj, options);
						this.plugins.bounds.marker2 = new Map.Marker(point2, this.mapObj, options);

						this.plugins.bounds.infoWindow = new Map.InfoWindow([0,0]);

						this.plugins.bounds.rectangle = this.createRectangle([point1, point2], {
							onClick: function() {
								var point1 = '[' + this.plugins.bounds.marker1.getPosition().lat().round(4) + ', ' + this.plugins.bounds.marker1.getPosition().lng().round(4) + ']';
								var point2 = '[' + this.plugins.bounds.marker2.getPosition().lat().round(4) + ', ' + this.plugins.bounds.marker2.getPosition().lng().round(4) + ']';
								var bounds = '[' + point1 + ', ' + point2 + ']';
								this.plugins.bounds.infoWindow.setContent('Point1: ' + point1 + '<br />Point2: ' + point2 + '<br />Bounds: ' + bounds);
								this.plugins.bounds.infoWindow.setPosition(this.plugins.bounds.rectangle.getBounds().getCenter());
								this.plugins.bounds.infoWindow.open(this.mapObj);
							}.bind(this)
						});
					} else {
						this.plugins.bounds.marker1.setPosition(point1);
						this.plugins.bounds.marker2.setPosition(point2);
						this.plugins.bounds.rectangle.setBounds( [this.plugins.bounds.marker1.getPosition(), this.plugins.bounds.marker2.getPosition()].toLatLngBounds() );

						this.plugins.bounds.marker1.show();
						this.plugins.bounds.marker2.show();
						this.plugins.bounds.rectangle.show();
					}

					el.addClass('googleButtonActive');
					this.plugins.bounds.active = true;
				} else {
					if (this.plugins.bounds.marker1 && this.plugins.bounds.marker2 && this.plugins.bounds.rectangle && this.plugins.bounds.infoWindow) {
						this.plugins.bounds.marker1.hide();
						this.plugins.bounds.marker2.hide();
						this.plugins.bounds.rectangle.hide();
						this.plugins.bounds.infoWindow.close();
					}

					el.removeClass('googleButtonActive');
					this.plugins.bounds.active = false;
				}
			}
		}
	}

});