'use strict';

/*
 * i18n config
 */

module.exports = [
	'$translateProvider',
	function($translateProvider) {

		$translateProvider.translations('en-US', require('../languages/en-US'));
		$translateProvider.translations('pt-BR', require('../languages/pt-BR'));

		$translateProvider.preferredLanguage(ybySettings.language);
		//$translateProvider.useLocalStorage();

	}
];