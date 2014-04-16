'use strict';

angular.module('yby.index', [])

.controller('IndexCtrl', [
	'$scope',
	'SessionService',
	'$location',
	'MapData',
	'ContentData',
	function($scope, Session, $location, MapData, ContentData) {

		$scope.$session = Session;

		$scope.$watch(function() {
			return Session.authenticated();
		}, function(isAuth) {
			$scope.isAuth = isAuth;
		});

		$scope.loggedin = Session.authenticated;

		$scope.$on('$stateChangeSuccess', function() {

			if($location.path() == '/') {
				angular.element('html').addClass('landing');
			}

		});

		$scope.$on('$stateChangeStart', function() {
			angular.element('html').removeClass('landing');
		});

		console.log(MapData);

		$scope.maps = MapData;
		$scope.contents = ContentData;

	}
]);