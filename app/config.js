'use strict';

const env = process.env.NODE_ENV;

let config = {
	siteUrl: 'http://localhost:8000',
	server: 'http://localhost:3000',
	apiPrefix: '/api/v1'
}

if (env === 'staging') {
  config.siteUrl = 'https://mapascoletivos.surge.sh',
  config.server = 'http://mc1-dev.herokuapp.com'
}

module.exports = config;
