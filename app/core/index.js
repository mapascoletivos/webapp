'use strict';

angular.module('mapasColetivos.index', [])

.controller('IndexCtrl', [
	'$scope',
	'SessionService',
	'$location',
	function($scope, Session, $location) {

		$scope.$session = Session;

		$scope.$watch('$session.authenticated()', function(auth) {
			if(auth)
				$location.path('/dashboard/');
		});

		$scope.$on('$stateChangeSuccess', function() {

			if($location.path() == '/') {
				angular.element('html').addClass('landing');
			}

		});

		$scope.$on('$stateChangeStart', function() {
			angular.element('html').removeClass('landing');
		})

	}
]);