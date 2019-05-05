"use strict";

module.exports = [
  "$scope",
  "SessionService",
  "$location",
  "config",
  "$sce",
  function($scope, Session, $location, config, $sce) {
    $scope.$session = Session;

    $scope.$watch("$session.authenticated()", function(auth) {
      $scope.isAuthenticated = auth;

      if (auth && $location.path() == "/login/") $location.path("/dashboard/");
    });

    var auth = function(provider, token) {
      Session.tokenAuth(token, provider, function(data) {
        $location.path("/dashboard");
      });
    };

    $scope.login = function(provider) {
      Session.authenticate($scope.credentials, function(data) {
        $location.path("/dashboard");
      });
    };

    $scope.register = function() {
      Session.register($scope.user);
    };

    $scope.recoverPwd = function() {
      Session.recoverPwd($scope.user);
    };

    $scope.logout = Session.logout;
  }
];
