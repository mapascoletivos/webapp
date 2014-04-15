'use strict';

module.exports = [
	'$scope',
	'SessionService',
	'$location',
	'config',
	'$sce',
	'Facebook',
	function($scope, Session, $location, config, $sce, Facebook) {

		$scope.$session = Session;

		$scope.$watch('$session.authenticated()', function(auth) {
			$scope.isAuthenticated = auth;
		});

		$scope.$watch(function() {
			return Facebook.isReady();
		}, function(ready) {
			$scope.facebookReady = ready;
		});

		var auth = function(provider, token) {

			Session.tokenAuth(token, provider, function(data) {
				$location.path('/dashboard');
			});

		}

		$scope.googleClientID = config.oauth.google;

		$scope.$on('event:google-plus-signin-success', function(event, response) {
			auth('google', response.access_token);
		});

		$scope.login = function(provider) {

			if(provider == 'facebook') {

				Facebook.getLoginStatus(function(response) {

					if(response.status == 'connected') {

						auth('facebook', response.authResponse.accessToken);

					} else {

						Facebook.login(function(response) {

							if(response.status == 'connected') {

								auth('facebook', response.authResponse.accessToken);

							}

						}, {scope: 'email'});

					}

				});

			} else {

				Session.authenticate($scope.credentials, function(data) {
					$location.path('/dashboard');
				});

			}

		};

		$scope.register = function() {

			Session.register($scope.user);

		}

		$scope.recoverPwd = function() {

			Session.recoverPwd($scope.user);

		}

		$scope.logout = Session.logout;

	}
];