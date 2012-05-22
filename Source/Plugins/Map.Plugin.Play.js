/*
---

name: Map.Plugin.Play

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map, Map.Marker, Map.InfoWindow, Map.Rectangle, More/Events.Pseudos]

provides: [Map.Plugin.Play]

...
*/

Map.implement({

	plugins: {
		play: {
			element: null,
			options: {},
			html: 'play',
			active: false,
			init: function(marker) {
				this.addEvent('markerAdded', function(marker) {
					marker.addEvent('open', function(content) {
						var slide = content.getElement('[data-behavior="Slide"]').getBehaviorResult('Slide');
						slide.options.active = true;
						if (content.getElement('[data-autostart="true"]')) {
							slide.start();
						}
						if (content.getElement('audio')) {
							content.getElement('audio').currentTime  = 0;
							content.getElement('audio').play();
						}
					});
					
					marker.addEvent('content_changed', function(content) {
						var slide = marker.wrap.getElement('[data-behavior="Slide"]').getBehaviorResult('Slide');
						slide.addEvent('finished', function() {
							slide.options.active = false;
							(function() { slide.show(0); }).delay(500);
							marker.close();
							var newIcon = content.getElement('[data-polyline-marker-icon]').get('data-polyline-marker-icon');
							if (newIcon !== '') {
								var animatedElements = this.getPolyLinesAnimated();
								animatedElements[0].marker.setIcon(newIcon);
							}
							if (content.getElement('audio')) {
								content.getElement('audio').pause();
							}
						}.bind(this));
					}.bind(this));
				});
			},
			onClick: function(element) {
				var animatedElements = this.getPolyLines();
				//animatedElements[0].showEditMarkers();
				var animatedElements = this.getPolyLinesAnimated();
				if (!this.plugins.play.active) {
				
					if (!this.plugins.play.started) {
						this.plugins.play.initAnimation.call(this, animatedElements);
						animatedElements.invoke('start');
						this.plugins.play.started = true;
					} else {
						animatedElements.invoke('resume');
					}
				
					element.set('text', 'pause');
					element.addClass('googleButtonActive');
					this.plugins.play.active = true;
				} else {
					animatedElements.invoke('pause');
				
					element.set('text', 'play');
					element.removeClass('googleButtonActive');
					this.plugins.play.active = false;
				}
			},
			initAnimation: function(animatedElements) {
				animatedElements.each(function(animatedElement) {
					animatedElement.addEvent('onPointChange', function(lat, lng) {
						this.markers.each(function(marker) {
							if (marker.getPosition().invoke('round', 6).equalTo([lat, lng].invoke('round', 6))) {
								var close = function() {
									(function() { animatedElement.resume(); }).delay(500);
								};
								marker.addEvent('closeclick:once', close);
								marker.wrap.getElement('[data-behavior="Slide"]').getBehaviorResult('Slide').addEvent('finished:once', close);
								
								marker.show(false, 'bounce');
								(function() { marker.open(); }).delay(1500);
								animatedElement.pause();
							}
						});
					}.bind(this));
				}, this);
			}
		}
	}
	
});