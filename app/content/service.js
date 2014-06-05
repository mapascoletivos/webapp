'use strict';

/*
 * Content service
 */
 
exports.Content = [
	'$resource',
	'$translate',
	'apiPrefix',
	function($resource, $translate, apiPrefix) {

		var contents = [];
		var editing = false;

		return {
			resource: $resource(apiPrefix + '/contents/:contentId', {}, {
				'query': {
					method: 'GET',
					isArray: false,
					loadingMessage: $translate.instant('Loading stories')
				},
				'get': {
					method: 'GET',
					loadingMessage: $translate.instant('Loading story')
				},
				'save': {
					method: 'POST',
					loadingMessage: $translate.instant('Creating content'),
					url: apiPrefix + '/contents',
					params: {
						layer: '@id'
					}
				},
				'delete': {
					method: 'DELETE',
					loadingMessage: $translate.instant('Removing content'),
					url: apiPrefix + '/contents/:contentId'
				},
				'update': {
					method: 'PUT',
					loadingMessage: $translate.instant('Saving content')
				}
			}),
			// Object sharing between controllers methods
			set: function(val) {
				contents = val;
				contents = _.sortBy(contents, function(c) {
					return c.createdAt;
				}).reverse();
			},
			add: function(val) {
				contents.push(val);
			},
			get: function() {
				return contents;
			},
			edit: function(content) {
				if(typeof content !== 'undefined')
					editing = content;

				return editing;
			},
			// Get content features method
			getFeatures: function(content, features) {

				if(content.features.length) {

					if(features && features.length) {

						var contentFeatures = features.filter(function(feature) {
							return content.features.indexOf(feature._id) !== -1;
						});

						return contentFeatures;

					}

				}

				return false;

			}
		};

	}
];