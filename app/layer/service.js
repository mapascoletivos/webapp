'use strict';

/*
 * Layer service
 */
exports.Layer = [
	'$resource',
	'$rootScope',
	'$translate',
	'apiPrefix',
	'SessionService',
	'LoadingService',
	'MessageService',
	function($resource, $rootScope, $translate, apiPrefix, Session, Loading, Message) {

		var editing = false;

		var params = {};

		return {
			resource: $resource(apiPrefix + '/layers/:layerId', null, {
				'query': {
					isArray: false,
					method: 'GET',
					loadingMessage: $translate.instant('Loading layers'),
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
				'userLayers': {
					isArray: false,
					method: 'GET',
					url: apiPrefix + '/user/layers',
					loadingMessage: $translate.instant('Loading layers'),
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
				'update': {
					method: 'PUT',
					loadingMessage: $translate.instant('Updating layer')
				},
				'get': {
					method: 'GET',
					loadingMessage: $translate.instant('Loading layer')
				},
				'delete': {
					method: 'DELETE',
					loadingMessage: $translate.instant('Removing layer')
				},
				'addContributor': {
					url: apiPrefix + '/layers/:layerId/contributors/add',
					method: 'PUT',
					loadingMessage: $translate.instant('Adding collaborator'),
					params: {
						layerId: '@layerId',
						email: '@email'
					}
				},
				'removeContributor': {
					url: apiPrefix + '/layers/:layerId/contributors/remove',
					method: 'DELETE',
					loadingMessage: $translate.instant('Removing collaborator'),
					params: {
						layerId: '@layerId',
						contributorId: '@contributorId'
					}
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
						page: (params.page || 1) + 1
					}), function(res) {
						if(res.layers.length) {
							self.busy = false;
							$rootScope.$broadcast('layer.page.next', res);
						}
						Loading.enable();
					});
				}
			},
			edit: function(layer) {
				if(typeof layer !== 'undefined')
					editing = layer;

				return editing;
			},
			isDraft: function(layer) {
				return layer.isDraft;
			},
			deleteDraft: function(layer) {
				Message.disable();
				if(this.isDraft(layer)) {
					this.resource.delete({layerId: layer._id}, function() {
						Message.enable();
					});
				}
			},
			isOwner: function(layer) {

				if(!layer || !Session.user())
					return false;

				// User is admin
				if(Session.user().role == 'admin')
					return true;

				if(typeof layer.creator == 'string' && layer.creator == Session.user()._id) {
					return true;
				} else if(typeof layer.creator == 'object' && layer.creator._id == Session.user()._id) {
					return true;
				}

				return false;

			},
			isContributor: function(layer) {

				if(!layer || !Session.user())
					return false;

				var is = false;

				if(layer.contributors && layer.contributors.length) {
					angular.forEach(layer.contributors, function(contributor) {
						if(typeof contributor == 'string' && contributor == Session.user()._id)
							is = true;
						else if(typeof contributor == 'object' && contributor._id == Session.user()._id)
							is = true;
					});
				}

				return is;

			},
			canCreate: function() {

				if(Session.user() && Session.user().role == 'collaborator')
					return false;

				return false;

			},
			canEdit: function(layer) {

				// User is admin
				if(Session.user() && Session.user().role == 'admin')
					return true;

				if(this.isOwner(layer) || this.isContributor(layer))
					return true;

				return false;

			},
			canDelete: function(layer) {

				// User is admin
				if(Session.user() && Session.user().role == 'admin')
					return true;

				if(this.isOwner(layer))
					return true;

				return false;
			}
		};

	}
];