'use strict';

module.exports = [
	'$scope',
	'SessionService',
	'$location',
	'config',
	'$sce',
	function($scope, Session, $location, config, $sce) {

		$scope.authFacebook = $sce.trustAsResourceUrl(config.server + '/auth/facebook');
		$scope.authGoogle = $sce.trustAsResourceUrl(config.server + '/auth/google');

		$scope.local = window.location.href;

		$scope.$session = Session;

		$scope.$watch('$session.authenticated()', function(auth) {
			$scope.isAuthenticated = auth;
		});

		$scope.login = function(provider) {
			if(provider == 'facebook') {

			} else if(provider == 'google') {

			} else {
				Session.authenticate($scope.credentials, function(data) {
					$location.path('/dashboard');
				});	
			}
		};

		$scope.logout = Session.logout;

	}
];