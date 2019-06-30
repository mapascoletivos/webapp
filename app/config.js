'use strict';

module.exports = {
	siteUrl: process.env.SITE_URL || 'http://localhost:8000',
	server: process.env.SERVER_URL || 'http://localhost:3000',
	apiPrefix: process.envAPI_PREFIX || '/api/v1'
};
