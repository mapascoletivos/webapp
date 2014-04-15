'use strict';

/*
 * User service
 */

exports.User = [
	'$resource',
	'config',
	'apiPrefix',
	function($resource, config, apiPrefix) {

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
					loadingMessage: 'Carregando usuário',
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
					loadingMessage: 'Atualizando usuário',
					url: apiPrefix + '/users',
					transformRequest: function(data) {
						if(data.email)
							delete data.email;
						return JSON.stringify(data);
					}
				},
				'updateEmail': {
					method: 'PUT',
					loadingMessage: 'Atualizando email',
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
					loadingMessage: 'Alterando senha'
				}
			}),
			gravatar: gravatar
		}

	}
]