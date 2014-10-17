'use strict';

/*
 * Map controller
 */

exports.MapActionsCtrl = [
	'$rootScope',
	'$scope',
	'$q',
	'$location',
	'$translate',
	'MessageService',
	'SessionService',
	'Map',
	'MapShare',
	function($rootScope, $scope, $q, $location, $translate, Message, Session, Map, MapShare) {

		$scope.$session = Session;

		$scope.$watch('$session.user().accessToken', function(user) {
			$scope.user = Session.user();
		});

		$scope.getUrl = function(map) {

			var url = window.location.protocol + '//' + window.location.host + '/maps/' + map._id;

			return url;

		};

		/*
		 * Permission control
		 */
		$scope.canEdit = function(map) {

			if(!map || !$scope.user)
				return false;

			// User is admin
			if($scope.user.role == 'admin')
				return true;

			if(typeof map.creator == 'string' && map.creator == $scope.user._id) {
				return true;
			} else if(typeof map.creator == 'object' && map.creator._id == $scope.user._id) {
				return true;
			}

			return false;

		};

		$scope.edit = function(map) {

			$location.path('/maps/' + map._id + '/edit');

		};

		$scope.save = function(map) {

			delete map.fetchedLayers;

			if(map.bounds) {
				map.southWest = map.bounds[0];
				map.northEast = map.bounds[1];
			}

			map.isDraft = false;

			var deferred = $q.defer();

			Map.resource.update({mapId: map._id}, map, function(map) {
				// Send back formatted map bounds
				if(map.southWest && map.northEast) {
					map.bounds = [map.southWest, map.northEast];
				}
				Message.message({
					status: 'ok',
					text: $translate.instant('Map updated')
				});
				$rootScope.$broadcast('map.save.success', map);
				deferred.resolve(map);
			}, function(err){
				Message.message({
					status: 'error',
					text: $translate.instant('Internal error')
				});
				$rootScope.$broadcast('map.save.error', err);
				deferred.resolve(err);
			});

			return deferred.promise;

		};

		$scope.delete = function(map, callback) {

			if(confirm($translate.instant('Are you sure you want to remove this map?'))) {
				Map.resource.delete({mapId: map._id}, function(res) {
					$rootScope.$broadcast('map.delete.success', map);
				});
			}

		};

		$scope.share = function(map) {
			MapShare.activate({
				map: map,
				social: {
					facebook: 'http://facebook.com/share.php?u=' + $scope.getUrl(map),
					twitter: 'http://twitter.com/share?url=' + $scope.getUrl(map)
				},
				socialWindow: function(url, type) {
					window.open(url, type, "width=550,height=300,resizable=1");
				},
				close: function() {
					MapShare.deactivate();
				}
			});

			$scope.$on('$destroy', function() {
				MapShare.deactivate();
			});
		};

		$scope.templates = {
			list: '/views/map/list-item.html'
		};

	}
];