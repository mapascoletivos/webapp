'use strict';

module.exports = [
	'$scope',
	'SessionService',
	'$location',
	function($scope, Session, $location) {

		$scope.$session = Session;

		$scope.$watch('$session.authenticated()', function(auth) {
			$scope.isAuthenticated = auth;
		});

		$scope.login = function() {
			Session.authenticate($scope.credentials, function(data) {
				$location.path('/dashboard');
			});
		};

		$scope.logout = Session.logout;

	}
];