'use strict';

angular
	.module('yby.pages', [])
	.config([
		'$stateProvider',
		function($stateProvider) {

			var pages = require('../config').pages;

			angular.forEach(pages, function(page) {

				$stateProvider.state('page' + page.path, {
					url: page.path,
					controller: 'PagesCtrl',
					templateUrl: page.template,
					resolve: {
						'PageData': function() {
							return page;
						}
					}
				});

			});

		}
	])
	.controller('PagesCtrl', [
		'$scope',
		'$state',
		'$translate',
		'Page',
		'PageData',
		function($scope, $state, $translate, Page, PageData) {
			Page.setTitle(PageData.title);
			$scope.$watch(function() {
				return $translate.use();
			}, function(locale) {
				$scope.locale = locale;
			});
		}
	]);