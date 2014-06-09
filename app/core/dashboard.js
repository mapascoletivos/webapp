'use strict';

angular.module('yby.dashboard', [])

.config([
	'$stateProvider',
	function($stateProvider) {

		$stateProvider
			.state('dashboard', {
				url: '/dashboard/',
				controller: 'DashboardCtrl',
				templateUrl: '/views/dashboard/index.html'
			})
			.state('dashboard.profile', {
				url: 'profile/',
				templateUrl: '/views/dashboard/profile.html'
			});

	}
])

.controller('DashboardCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$state',
	'$stateParams',
	'SessionService',
	'$location',
	'$translate',
	'Page',
	'User',
	'Layer',
	'Map',
	function($scope, $rootScope, $timeout, $state, $stateParams, Session, $location, $translate, Page, User, Layer, Map) {

		Page.setTitle($translate.instant('Painel de Controle'));

		$scope.isDashboard = true;

		$scope.$session = Session;

		$scope.$watch('$session.authenticated()', function(auth) {

			if(!auth) {
				$location.path('/login/');
			}

		});

		var setUser = function(u) {
			var user = angular.copy(u);
			if(user) {
				User.resource.get({
					userId: user._id
				}, function(res) {

					$scope.user = res;
					$scope.userName = angular.copy($scope.user.name);

				});

				$scope.canCreate = !(user.role == 'collaborator');

				// Check user role to show all layers if admin
				// if(user.role == 'admin') {
				// 	var layerReq = Layer.resource.query;
				// 	var mapReq = Map.resource.query;
				// } else {
				// 	var layerReq = Layer.resource.userLayers;
				// 	var mapReq = Map.resource.userMaps;
				// }

				var layerReq = Layer.resource.userLayers;
				var mapReq = Map.resource.userMaps;

				// Get layers
				$scope.$layer = Layer;
				layerReq(function(res) {
					$scope.totalLayer = res.layersTotal;
					$scope.layers = res.layers;

					/*
					 * Pagination
					 */
					$scope.$on('layer.page.next', function(event, res) {
						if(res.layers.length) {
							angular.forEach(res.layers, function(layer) {
								$scope.layers.push(layer);
							});
							$scope.layers = $scope.layers; // trigger digest
						}
					});

				});

				// Get maps
				$scope.$map = Map;
				mapReq(function(res) {
					
					$scope.totalMap = res.mapsTotal;
					$scope.maps = res.maps;

					/*
					 * Pagination
					 */
					$scope.$on('map.page.next', function(event, res) {
						if(res.maps.length) {
							angular.forEach(res.maps, function(map) {
								$scope.maps.push(map);
							});
							$scope.maps = $scope.maps; // trigger digest
						}
					});
				});

			}
		}

		$scope.$watch('$session.user()', _.once(setUser));

		$scope.$on('user.save.success', function(event, user) {
			setUser(user);
		});

		var stateFunctions = function() {
			if($state.current.name === 'dashboard') {
				$location.path('/dashboard/layers').replace();
			}
			$scope.currentState = $state.current.name.replace('dashboard.', '');
		}

		$rootScope.$on('$viewContentLoaded', function() {
			stateFunctions();
		});

		$rootScope.$on('$stateChangeSuccess', function() {
			stateFunctions();
		});

		$rootScope.$on('map.delete.success', function(event, map) {
			$scope.maps = $scope.maps.filter(function(m) { return map._id != m._id; });
		});

		$rootScope.$on('layer.add.success', function(event, layer) {
			$scope.layers = [layer].concat($scope.layers);
		});

		$rootScope.$on('layer.delete.success', function(event, layer) {
			$scope.layers = $scope.layers.filter(function(m) { return layer._id != m._id; });
		});

	}
]);