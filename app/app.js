'use strict';

/*
 * Helpers
 */
require('./helpers');

/*
 * Core modules
 */

require('./core/settings');
require('./core/title');
require('./core/index');
require('./core/loading');
require('./core/message');
require('./core/explore');
require('./core/dashboard');

/*
 * Common modules
 */

require('./common/leaflet');
require('./common/directives');
require('./common/mapView');

/*
 * Apps
 */

require('./session/app');
require('./user/app');
require('./import/app');
require('./feature/app');
require('./content/app');
require('./layer/app');
require('./map/app');

window.ybySettings = angular.extend({
	server: 'local',
	apiPrefix: '/api/v1',
	language: 'en-US'
}, require('./config'));

/*
 * App
 */
angular.module('yby', [
	'ngCookies',
	'pascalprecht.translate',
	'ui.router',
	'ui.keypress',
	'ui.slider',
	'monospaced.elastic',
	'ngRoute',
	'ngAnimate',
	'infinite-scroll',
	'colorpicker.module',
	'yby.settings',
	'yby.mapView',
	'yby.user',
	'yby.pageTitle',
	'yby.directives',
	'yby.session',
	'yby.index',
	'yby.dashboard',
	'yby.explore',
	'yby.loadingStatus',
	'yby.messageStatus',
	'yby.dataImport',
	'yby.map',
	'yby.layer',
	'yby.feature',
	'yby.content'
])
.constant('config', ybySettings)
.constant('apiPrefix', (ybySettings.server == 'local' ? '' : ybySettings.server) + ybySettings.apiPrefix)

/*
 * Translation
 */

.config(require('./core/i18n'))
.controller('TranslateCtrl', [
	'$scope',
	'$translate',
	function($scope, $translate) {

		$scope.changeLanguage = function(key) {
			$translate.use(key);
		}

	}
])

/*
 * Core routes
 */

.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	'$httpProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		if(ybySettings.server !== 'local') {
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				controller: 'IndexCtrl',
				templateUrl: '/views/pages/landing.html',
				resolve: {
					'MapData': [
						'$q',
						'Map',
						function($q, Map) {

							var deferred = $q.defer();

							Map.resource.query({
								perPage: 4
							}, function(res) {

								deferred.resolve(res.maps);

							});

							return deferred.promise;

						}
					],
					'ContentData': [
						'$q',
						'Content',
						function($q, Content) {

							var deferred = $q.defer();

							Content.resource.query({
								perPage: 4
							}, function(res) {

								deferred.resolve(res.contents);

							});

							return deferred.promise;

						}
					]
				}
			});

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');

		var interceptor = ['$rootScope', '$q', '$location', function(scope, $q, $location) {

			function success(response) {
				return response;
			}

			function error(response) {

				var status = response.status;

				if (status == 401) {
					$location.path('/login');
					return;
				}
				// otherwise
				return $q.reject(response);

			}

			return function (promise) {
				return promise.then(success, error);
			}

		}];

		$httpProvider.responseInterceptors.push(interceptor);

		/*
		 * Trailing slash rule
		 */
		$urlRouterProvider.rule(function($injector, $location) {
			var path = $location.path(),
				search = $location.search(),
				params;

			// check to see if the path already ends in '/'
			if (path[path.length - 1] === '/') {
				return;
			}

			// If there was no search string / query params, return with a `/`
			if (Object.keys(search).length === 0) {
				return path + '/';
			}

			// Otherwise build the search string and return a `/?` prefix
			params = [];
			angular.forEach(search, function(v, k){
				params.push(k + '=' + v);
			});
			
			return path + '/?' + params.join('&');
		});

	}
])

.run([
	'$rootScope',
	'$location',
	function($rootScope, $location) {

		/*
		 * Store nav history
		 */
		window.ybyHistory = [];
		$rootScope.$on('$stateChangeSuccess', function() {
			if(window._gaq) {
				window._gaq.push(['_trackPageview', $location.path()]);
			}
			window.ybyHistory.push(window.location.pathname);
		});

	}
])

.controller('PageCtrl', [
	'$scope',
	'Page',
	'config',
	function($scope, Page, config) {
		// Page title
		$scope.page = Page;
		// Detect iframe
		if(window !== window.top) {
			$scope.embedded = true;
		}

		$scope.siteTitle = 'YBY';

		$scope.ybySettings = config;

		$scope.siteTitle = $scope.ybySettings.general.title;
		Page.setBaseTitle($scope.siteTitle);
	}
]);

/*
 * Initialize appication
 */

$(document).ready(_.once(function() {
	$('body').hide();
	$.get(window.ybySettings.server + window.ybySettings.apiPrefix + '/settings', function(serverSettings) {
		window.ybySettings = angular.extend(window.ybySettings, serverSettings);
		window.ybySettings.language = serverSettings.general.language;
		angular.bootstrap(document, ['yby']);
		$('body').show();
	}, 'json');
}));