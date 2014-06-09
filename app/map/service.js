'use strict';

/*
 * Map service
 */

exports.Map = [
	'$resource',
	'$rootScope',
	'$translate',
	'apiPrefix',
	'LoadingService',
	'MessageService',
	function($resource, $rootScope, $translate, apiPrefix, Loading, Message) {

		var params = {};

		return {
			resource: $resource(apiPrefix + '/maps/:mapId', null, {
				'query': {
					isArray: false,
					method: 'GET',
					loadingMessage: $translate.instant('Loading maps'),
					params: {
						perPage: 10,
						page: 1
					},
					interceptor: {
						response: function(data) {
							params = data.config.params;
							return data.data;
						}
					}
				},
				'userMaps': {
					isArray: false,
					method: 'GET',
					url: apiPrefix + '/user/maps',
					loadingMessage: $translate.instant('Loading maps'),
					params: {
						perPage: 10,
						page: 1
					},
					interceptor: {
						response: function(data) {
							params = data.config.params;
							return data.data;
						}
					}
				},
				'get': {
					method: 'GET',
					loadingMessage: $translate.instant('Loading map'),
					interceptor: {
						response: function(data) {
							var map = data.data;

							if(map.southWest && map.northEast) {
								map.bounds = [map.southWest, map.northEast];
							}

							return map;
						}
					}
				},
				'update': {
					method: 'PUT',
					loadingMessage: $translate.instant('Updating map')
				},
				'delete': {
					method: 'DELETE',
					loadingMessage: $translate.instant('Removing map')
				}
			}),
			busy: false,
			nextPage: function(req) {
				
				if(typeof req == 'undefined')
					req = 'query';

				var self = this;
				Loading.disable();
				if(!self.busy) {
					self.busy = true;
					this.resource[req](_.extend(params, {
						page: params.page + 1
					}), function(res) {
						if(res.maps.length) {
							self.busy = false;
							$rootScope.$broadcast('map.page.next', res);
						}
						Loading.enable();
					});
				}
			},
			isDraft: function(map) {
				return map.isDraft;
			},
			deleteDraft: function(map) {
				Message.disable();
				if(this.isDraft(map)) {
					this.resource.delete({mapId: map._id}, function() {
						Message.enable();
					});
				}
			}
		}

	}
];