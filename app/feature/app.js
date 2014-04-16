'use strict';

angular
	.module('yby.feature', [])
	.factory('Feature', require('./service').Feature)
	.factory('Maki', require('./makiService').Maki)
	.controller('FeatureCtrl', require('./controller').FeatureCtrl)
	.controller('FeatureEditCtrl', require('./editController').FeatureEditCtrl);