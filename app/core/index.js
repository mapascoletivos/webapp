'use strict';

angular.module('yby.index', [])

.controller('IndexCtrl', [
	'$scope',
	'SessionService',
	'$location',
	'MapData',
	'ContentData',
	'Page',
	function($scope, Session, $location, MapData, ContentData, Page) {

		$scope.$session = Session;

		$scope.$watch('$session.authenticated()', function(auth) {
			$scope.isAuth = auth;
		});

		$scope.loggedin = Session.authenticated;

		$scope.$on('$stateChangeSuccess', function() {

			if($location.path() == '/') {
				Page.setTitle('');
				angular.element('html').addClass('landing');
			}

		});

		$scope.$on('$stateChangeStart', function() {
			angular.element('html').removeClass('landing');
		});

		$scope.maps = MapData;
		$scope.contents = ContentData;

	}
]);