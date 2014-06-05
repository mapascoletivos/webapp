'use strict';

/*
 * User service
 */

exports.User = [
	'$resource',
	'$translate',
	'config',
	'apiPrefix',
	function($resource, $translate, config, apiPrefix) {

		var gravatar = function(email, size) {

			if(typeof size === 'undefined')
				size = 100;

			if(typeof email !== 'undefined') {

				return grvtr.create(email, {
					size: size,
					defaultImage: 'mm',
					rating: 'g'
				});

			}

			return '';
		}

		return {
			resource: $resource(apiPrefix + '/users/:userId', {}, {
				'get': {
					method: 'GET',
					loadingMessage: $translate.instant('Loading user'),
					interceptor: {
						response: function(data) {
							var res = data.data;
							res.gravatar = function(size) {
								return gravatar(res.email, size);
							}
							return res;
						}
					}
				},
				'update': {
					method: 'PUT',
					loadingMessage: $translate.instant('Updating user'),
					url: apiPrefix + '/users',
					transformRequest: function(data) {
						if(data.email)
							delete data.email;
						return JSON.stringify(data);
					}
				},
				'updateEmail': {
					method: 'PUT',
					loadingMessage: $translate.instant('Updating email'),
					url: apiPrefix + '/users',
					transformRequest: function(data) {
						if(data.email) {
							data.callback_url = config.siteUrl;
						}
						return JSON.stringify(data);
					}
				},
				'updatePwd': {
					method: 'PUT',
					loadingMessage: $translate.instant('Updating password')
				}
			}),
			gravatar: gravatar
		}

	}
]