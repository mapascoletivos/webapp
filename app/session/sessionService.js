'use strict';

module.exports = [
	'$window',
	'$q',
	'$http',
	'$rootScope',
	'$location',
	'apiPrefix',
	'config',
	function($window, $q, $http, $rootScope, $location, apiPrefix, config) {

		var login = function(data, callback) {

			for(var key in data) {
				$window.sessionStorage[key] = data[key];
			}
			$rootScope.$broadcast('session.logged.in');
			if(typeof callback === 'function')
				callback(data);

		};

		return {
			authenticate: function(credentials, callback) {
				$http
					.post(apiPrefix + '/access_token/local', _.extend({ callback_url: config.siteUrl + '/login/'}, credentials))
					.success(function(data, status, headers, config) {
						login(data, callback);
					});
			},
			tokenAuth: function(token, provider, callback) {
				$http({
					url: apiPrefix + '/access_token/' + provider,
					method: 'POST',
					headers: {
						'Authorization': 'Bearer ' + token,
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).success(function(data, status, headers, config) {
					login(data, callback);
				});
			},
			register: function(user) {
				$http
					.post(apiPrefix + '/users', _.extend({ callback_url: config.siteUrl + '/login/' }, user))
					.success(function(data, status, headers, config) {
						$location.path('/login/');
					});
			},
			recoverPwd: function(user) {
				$http
					.post(apiPrefix + '/forgot_password', _.extend({ callback_url: config.siteUrl + '/login/' }, user))
					.success(function(data, status, headers, config) {
						$location.path('/login/');
					});
			},
			logout: function() {
				$http
					.get(apiPrefix + '/access_token/logout')
					.success(function() {
						for(var key in $window.sessionStorage) {
							delete $window.sessionStorage[key];
						}	
						$location.path('/login/');
					});
			},
			authenticated: function() {
				return !! $window.sessionStorage.accessToken;
			},
			user: function(val) {
				if(val)
					$window.sessionStorage = _.extend($window.sessionStorage, val);
				return $window.sessionStorage;
			}
		};
	}
];