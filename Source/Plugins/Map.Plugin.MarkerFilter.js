/*
---

name: Map.Plugin.FilterByType

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul

requires: [Map.Marker]

provides: [Map]

...
*/

Map.implement({

	plugins: {
		markerfilter: {
			el: new Element('form'),
			options: {position: 'BOTTOM_CENTER'},
			active: false
		}
	},

	createMarkerFilterPlugin: function(markerAttr, typesArray, legend, id_prefix) {
		if(! this.plugins.markerfilter.active) {
			markerAttr = !!markerAttr && typeOf(markerAttr) === 'string' ? markerAttr : 'isType';
			typesArray = typeOf(typesArray) === 'array' && typesArray.every(function(item) { return typeOf(item) === 'string'; }) ? typesArray : ['marker'];
			var legend = typeOf(this.plugins.markerfilter.options.legend) === 'string' ? this.plugins.markerfilter.options.legend : 'Markers Filter';
			var id_prefix = typeOf(this.plugins.markerfilter.options.id_prefix) === 'string' ? this.plugins.markerfilter.options.id_prefix : 'PluginMarkerFilter';

			var listEl = new Element('ul', {styles: {'list-style': 'none'} });

			Array.each(typesArray, function(markerType) {
				var typeLiEl = new Element('li', { html: '<label for="'.concat(id_prefix, '_', markerType,'" >', markerType, '</label>'), styles: {} }).inject(listEl);
				var typeCheckboxEl = new Element('input', {id: id_prefix.concat('_', markerType), type: 'checkbox', name: markerType, value: markerType}).inject(typeLiEl);

				typeCheckboxEl.addEvent('click', function(ev) {

					Array.each(this.markers, function(marker) {
						if(marker.options[markerAttr] !== undefined && marker.options[markerAttr] == ev.target.value) {
							marker.setVisible( ev.target.checked );
						}
					}, this);

				}.bind(this));

			}, this);

			this.plugins.markerfilter.el.set('id', id_prefix);
			var fieldsetEl = new Element('fieldset').inject(this.plugins.markerfilter.el);
			var fieldsetLegendEl = new Element('legend', {html: legend}).inject(fieldsetEl);
			listEl.inject(fieldsetEl);
		}

		this.plugins.markerfilter.active = true; // Create only once.
	}

});