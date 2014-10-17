'use strict';

module.exports = [
	'ipCookie',
	'$q',
	'$http',
	'$rootScope',
	'$location',
	'apiPrefix',
	'config',
	function(ipCookie, $q, $http, $rootScope, $location, apiPrefix, config) {

		var login = function(data, callback) {

			ipCookie('session', data, { expires: 21, path: '/' });

			$.ajaxSetup({
				beforeSend: function(req) {
					req.setRequestHeader("Authorization", 'Bearer ' + data.accessToken);
				}
			});

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
				ipCookie.remove('session', { path: '/'});
				if(typeof gapi !== 'undefined') gapi.auth.signOut();
				$http
					.get(apiPrefix + '/access_token/logout')
					.success(function() {
						$location.path('/login/');
					})
					.error(function() {
						$location.path('/login/');
					});
			},
			authenticated: function() {
				if(ipCookie('session')) {
					return true;
				} else {
					return false;
				}
			},
			user: function(val) {
				var session = _.clone(ipCookie('session'));
				if(val)
					ipCookie('session', _.extend(session, val), { expires: 21, path: '/' });
				return ipCookie('session');
			}
		};
	}
];