'use strict';

/*
 * Feature service
 */
exports.Feature = [
	'$resource',
	'$translate',
	'apiPrefix',
	function($resource, $translate, apiPrefix) {

		var features = [],
			filter = false,
			editing = false;

		return {
			resource: $resource(apiPrefix + '/features/:featureId', {}, {
				'query': {
					method: 'GET',
					isArray: false,
					loadingMessage: $translate.instant('Loading locations')
				},
				'get': {
					method: 'GET',
					loadingMessage: $translate.instant('Loading location')
				},
				'import': {
					method: 'POST',
					isArray: true,
					loadingMessage: $translate.instant('Importing data'),
					url: apiPrefix + '/layers/:layerId/features/import'
				},
				'save': {
					method: 'POST',
					loadingMessage: $translate.instant('Creating location'),
					url: apiPrefix + '/layers/:layerId/features'
				},
				'delete': {
					method: 'DELETE',
					loadingMessage: $translate.instant('Removing location'),
					url: apiPrefix + '/layers/:layerId/features/:featureId'
				},
				'update': {
					method: 'PUT',
					loadingMessage: $translate.instant('Updating location')
				}
			}),
			// Object sharing between controllers methods
			set: function(val) {
				features = val;
			},
			add: function(val) {
				features.push(val);
			},
			get: function() {
				return features;
			},
			edit: function(content) {
				if(typeof content !== 'undefined')
					editing = content;

				return editing;
			},
			getContents: function(feature, contents) {

				if(feature.contents.length) {

					if(contents && contents.length) {

						var featureContents = contents.filter(function(content) {
							return feature.contents.indexOf(content._id) !== -1;
						});

						return featureContents;

					}

				}

				return false;

			}
		};

	}
];