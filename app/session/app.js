'use strict';

angular
	.module('yby.session', [
		'facebook',
		'yby.settings',
		'directive.g+signin'
	])
	.config([
		'$stateProvider',
		'FacebookProvider',
		function($stateProvider, FacebookProvider) {

			$stateProvider
				.state('login', {
					url: '/login/',
					controller: 'LoginCtrl',
					templateUrl: '/views/login.html'
				});

			$stateProvider
				.state('signup', {
					url: '/signup/',
					controller: 'LoginCtrl',
					templateUrl: '/views/signup.html'
				});

			$stateProvider
				.state('forgotPwd', {
					url: '/forgot-password/',
					controller: 'LoginCtrl',
					templateUrl: '/views/forgot_pwd.html'
				});

			if(window.ybySettings.general.facebookApiKey)
				FacebookProvider.init(window.ybySettings.general.facebookApiKey);
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
					config.headers = config.headers || {};
					if ($window.sessionStorage.accessToken) {
						//config.withCredentials = true;
						config.headers.Authorization = 'Bearer ' + $window.sessionStorage.accessToken;
					}
					return config || $q.when(config);
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