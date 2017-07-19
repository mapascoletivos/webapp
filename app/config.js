'use strict';

var env = process.env;

module.exports = {
	siteUrl: env.SITE_URL || 'http://localhost:8000', // Client URL. Eg: http://my-yby-service.com
	server: env.SERVER_URL || 'http://localhost:3000', // Server URL. Eg: http://server.my-yby-service.com
	apiPrefix: env.API_PREFIX || '/api/v1' // You probably won't change this
};
