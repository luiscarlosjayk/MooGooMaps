/*
---

name: Map.Plugin.Seeker

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul

requires: [Map, Map.Marker, Map.Circle]

provides: [Map]

...
*/

Map.implement({

	plugins: {
		seeker: {
			el: null,
			options: {},
			html: 'seeker',
			active: false,
			onClick: function(el) {
				if(!this.plugins.seeker.active) {
					function searchScope() {
						Array.each(this.markers, function(marker) { // Return previous markers state.
							var isInside = this.plugins.seeker.circle.getBounds().contains(marker.getPosition());
							marker.setVisible(isInside);
						}, this);
					};
					
					var center = this.getCenter();
					var dx = [center.lat(), this.getBounds().getSouthWest().lng()].distanceTo( center.toArray() ) *0.9;
					var dy = [this.getBounds().getSouthWest().lat(), center.lng()].distanceTo( center.toArray() ) *0.9;
					var distance = dx <= dy ? dx : dy;
					
					if(!this.plugins.seeker.marker && !this.plugins.seeker.circle) { // First seeker run: Preserve markers previous visible state.
						Array.each(this.markers, function(marker) { // Preserve markers visible state.
							marker.isVisible = marker.getVisible();
						}, this);
						
						//create
						this.plugins.seeker.circle = this.createCircle(center, distance, {});
						this.plugins.seeker.circle.circleObj.bindTo('center', this.mapObj);
						
						this.plugins.seeker.marker = this.createMarker([center.lat(), this.plugins.seeker.circle.getBounds().getNorthEast().lng()], {
							draggable: true,
							isPlugin: true
						});
						
						this.plugins.seeker.marker.addEvent('drag', function() {
							if(this.plugins.seeker.active) {
								this.plugins.seeker.marker.setPosition([this.getCenter().lat(), this.plugins.seeker.marker.getPosition().lng()]);
								var distance = Map.geometry.computeDistanceBetween(this.plugins.seeker.marker.getPosition(), this.getCenter());
								this.plugins.seeker.circle.setRadius(distance);
								
								// Search for markers inside search scope.
								searchScope.apply(this);
							}
						}.bind(this));
						
						this.plugins.seeker.circle.circleObj.center_changed = function() {
							if(this.plugins.seeker.active) {
								var leftDist = Map.geometry.computeDistanceBetween(this.plugins.seeker.marker.getPosition(), this.plugins.seeker.circle.getBounds().getSouthWest());
								var rightDist = Map.geometry.computeDistanceBetween(this.plugins.seeker.marker.getPosition(), this.plugins.seeker.circle.getBounds().getNorthEast());
								var newLng = leftDist <= rightDist ? this.plugins.seeker.circle.getBounds().getSouthWest().lng() : this.plugins.seeker.circle.getBounds().getNorthEast().lng();
								this.plugins.seeker.marker.setPosition([this.getCenter().lat(), newLng]);
								
								// Search for markers inside search scope.
								searchScope.apply(this);
							}
						}.bind(this);
						
						// Search for markers inside search scope.
						searchScope.apply(this);
						
					} else { // Consecuently seeker run: Show components.
						this.plugins.seeker.circle.show();
						this.plugins.seeker.marker.show();
						this.plugins.seeker.marker.setPosition([this.getCenter().lat(), this.plugins.seeker.circle.getBounds().getNorthEast().lng()]);
						
						// Search for markers inside search scope.
						searchScope.apply(this);
					}
					
					el.addClass('goolgeButtonActive');
					this.plugins.seeker.active = true;
				}
				else { // OFF: Hide components & return previous markers visible state.
					if(this.plugins.seeker.marker && this.plugins.seeker.circle) {
						this.plugins.seeker.circle.hide();
						this.plugins.seeker.marker.hide();
					}
					
					Array.each(this.markers, function(marker) { // Return previous markers visible state.
						if(marker.options.isPlugin === undefined || marker.options.isPlugin === null) {
							marker.setVisible(marker.isVisible);
							delete marker.isVisible;
						}
					}, this);
					el.removeClass('goolgeButtonActive');
					this.plugins.seeker.active = false;
				}
			}
		}
	}
});