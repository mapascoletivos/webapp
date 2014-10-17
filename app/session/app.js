'use strict';

angular
	.module('yby.session', [
		'facebook',
		'yby.settings',
		'directive.g+signin',
		'ivpusic.cookie'
	])
	.config([
		'$stateProvider',
		'FacebookProvider',
		function($stateProvider, FacebookProvider) {

			$stateProvider
				.state('login', {
					url: '/login/',
					controller: 'LoginCtrl',
					templateUrl: '/views/auth/login.html'
				});

			$stateProvider
				.state('signup', {
					url: '/signup/',
					controller: 'LoginCtrl',
					templateUrl: '/views/auth/signup.html'
				});

			$stateProvider
				.state('forgotPwd', {
					url: '/forgot-password/',
					controller: 'LoginCtrl',
					templateUrl: '/views/auth/forgot_pwd.html'
				});

			if(window.ybySettings.general.facebookApiKey && window.ybySettings.general.facebookApiKey.length > 0)
				FacebookProvider.init(window.ybySettings.general.facebookApiKey);
		}
	])
	.factory('SessionService', require('./sessionService'))
	.controller('LoginCtrl', require('./loginCtrl'))
	.factory('authInterceptor', [
		'$rootScope',
		'$q',
		'ipCookie',
		function($rootScope, $q, ipCookie) {

			$.ajaxSetup({
				beforeSend: function(req) {
					var session = ipCookie('session');
					if(session && session.accessToken) {
						req.setRequestHeader("Authorization", 'Bearer ' + session.accessToken);
					}
				}
			});

			return {
				request: function(config) {
					var session = ipCookie('session');
					config.headers = config.headers || {};
					if (session && session.accessToken) {
						//config.withCredentials = true;
						config.headers.Authorization = 'Bearer ' + session.accessToken;
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