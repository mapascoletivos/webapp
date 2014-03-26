'use strict';

angular
	.module('mapasColetivos.session', [])
	.config([
		'$stateProvider',
		function($stateProvider) {

			$stateProvider
				.state('login', {
					url: '/login/',
					controller: 'LoginCtrl',
					templateUrl: '/views/login.html'
				});
		}
	])
	.factory('SessionService', require('./sessionService'))
	.controller('LoginCtrl', require('./loginCtrl'))
	.factory('authInterceptor', [
		'$rootScope',
		'$q',
		'$window',
		function($rootScope, $q, $window) {
			return {
				request: function(config) {
					config.params = config.params || {};
					if ($window.sessionStorage.accessToken) {
						config.params.access_token = $window.sessionStorage.accessToken;
					}
					return config;
				},
				responseError: function(rejection) {
					if (rejection.status === 401) {
						// handle the case where the user is not authenticated
					}
					return $q.reject(rejection);
				}
			};
		}
	])
	.config([
		'$httpProvider',
		function($httpProvider) {
			$httpProvider.interceptors.push('authInterceptor');
		}
	]);