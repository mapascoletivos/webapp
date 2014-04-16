'use strict';

angular.module('yby.pageTitle', [])

.factory('Page', [
	function() {
		var baseTitle = 'YBY';
		var title = baseTitle;
		var page = '';
		return {
			setBaseTitle: function(title) {
				baseTitle = title;
				this.setTitle(page);
			},
			title: function() {
				return title;
			},
			setTitle: function(val) {
				page = val;
				if(val)
					title = page + ' - ' + baseTitle;
				else
					title = baseTitle;
			}
		}
	}
]);