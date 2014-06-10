'use strict';

/*
 * Loading module
 */
angular.module('yby.loadingStatus', [])

.config([
	'$httpProvider',
	function($httpProvider) {
		$httpProvider.interceptors.push('loadingStatusInterceptor');
	}
])

.service('LoadingService', [
	'$translate',
	function($translate) {

		var loads = [];

		return {
			get: function() {
				return loads;
			},
			add: function(text, id) {
				if(typeof id == 'undefined')
					id = Math.random();

				var load = {
					_id: id,
					msg: text
				};

				loads.push(load);
				loads = loads; // trigger digest?
				return load._id;
			},
			remove: function(id) {
				//delete loads[loads.length];
				loads = loads.filter(function(load) { return load._id !== id; });
				loads = loads; // trigger digest?
				return loads;
			},
			disable: function() {
			},
			enable: function() {
			}
		}

	}
])

.directive('loadingStatusMessage', [
	'LoadingService',
	function(service) {
		return {
			link: function($scope, $element, attrs) {
				$scope.$watch(function() {
					return service.get();
				}, function(loads) {
					$scope.loads = loads;
				});
			},
			template: '<div class="loading-message"><span ng-repeat="load in loads" ng-show="load.msg">{{load.msg}}<br/></span></div>'
		};
	}
])

.factory('loadingStatusInterceptor', [
	'$q',
	'$rootScope',
	'$timeout',
	'$translate',
	'LoadingService',
	function($q, $rootScope, $timeout, $translate, service) {
		return {
			request: function(config) {

				if(config.loadingMessage)
					config.loadingId = service.add(config.loadingMessage);

				return config || $q.when(config);
			},
			response: function(response) {

				if(response.config.loadingId)
					service.remove(response.config.loadingId);

				return response || $q.when(response);
			},
			responseError: function(rejection) {


				if(rejection.config.loadingId)
					service.remove(rejection.config.loadingId);

				return $q.reject(rejection);
			}
		};
	}
]);