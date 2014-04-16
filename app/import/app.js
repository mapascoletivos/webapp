'use strict';

angular
	.module('yby.dataImport', [])
	.directive('importInput', require('./directive').ImportInput)
	.directive('importInputTrigger', require('./directive').ImportInputTrigger)
	.controller('DataImportCtrl', require('./controller').DataImportCtrl);