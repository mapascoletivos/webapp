'use strict';

angular.module('yby.settings', [])

.factory('SiteSettings', [
	'$http',
	'apiPrefix',
	function($http, apiPrefix) {

		var settings = false;

		return {
			'get': function() {

				if(settings)
					return settings;

				$http
					.get(apiPrefix + '/settings')
					.success(function(data) {
						settings = data;
						return settings;
					});

			}
		}

	}
]);