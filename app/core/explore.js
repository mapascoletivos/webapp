'use strict';

angular.module('yby.explore', [])

.config([
	'$stateProvider',
	function($stateProvider) {

		$stateProvider
			.state('explore', {
				url: '/explore/',
				controller: 'ExploreCtrl',
				templateUrl: '/views/explore.html'
			});

	}
])

.controller('ExploreCtrl', [
	'$scope',
	'$translate',
	'Page',
	'Layer',
	'Map',
	function($scope, $translate, Page, Layer, Map) {

		Page.setTitle($translate.instant('Explore the community'));

		Layer.resource.get({
			perPage: 4
		}, function(res) {

			$scope.layers = res.layers;

		});

		Map.resource.get({
			perPage: 4
		}, function(res) {

			$scope.maps = res.maps;

		});

	}
]);