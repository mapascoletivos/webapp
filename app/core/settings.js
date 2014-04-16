'use strict';

angular.module('yby.settings', [])

.factory('SiteSettings', [
	'$q',
	'$http',
	'apiPrefix',
	function($q, $http, apiPrefix) {

		var settings = false;

		return {
			'get': function() {

				var deferred = $q.defer();

				if(settings)
					deferred.resolve(settings);

				$http
					.get(apiPrefix + '/settings')
					.success(function(data) {
						settings = data;
						deferred.resolve(data);
					});

				return deferred.promise;

			}
		}

	}
]);