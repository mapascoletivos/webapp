'use strict';

/*
 * Geocode service
 */

angular.module('yby.geocode', [])

.factory('GeocodeService', [
	'$http',
	'$translate',
	function($http, $translate) {
		return {
			get: function(query) {
				return $http.jsonp('http://nominatim.openstreetmap.org/search.php?q=' + query + '&format=json&polygon_geojson=1&json_callback=JSON_CALLBACK', {
					loadingMessage: $translate.instant('Finding locations')
				});
			}
		}
	}
]);