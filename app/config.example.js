'use strict';

module.exports = {
	siteUrl: 'http://localhost:8000', // Client URL. Eg: http://my-yby-service.com
	server: 'http://localhost:3000', // Server URL. Eg: http://server.my-yby-service.com
	apiPrefix: '/api/v1', // You probably won't change this
	language: 'en-US', // Language (see app/languages for available languages)
	oauth: {
		facebook: '', // Facebook Client ID
		google: '' // Google client ID
	}
};