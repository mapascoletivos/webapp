'use strict';

/*
 * Content edit controller
 */

exports.ContentEditCtrl = [
	'$scope',
	'$rootScope',
	'$translate',
	'Content',
	'Layer',
	'MessageService',
	'SirTrevor',
	'MapService',
	function($scope, $rootScope, $translate, Content, Layer, Message, SirTrevor, MapService) {

		var original,
			layer;

		$scope.$layer = Layer;

		$scope.$watch('$layer.edit()', function(editing) {
			layer = editing;
		});

		$scope.$content = Content;

		$scope.$watch('$content.get()', function(contents) {
			$scope.contents = contents;
		});

		$scope.$watch('$content.edit()', function(editing) {
			$scope.editing = editing;
			if($scope.editing.sections) {
				var sTString = {
					data: $scope.editing.sections.slice(0)
				};
				$scope.editing.sirTrevor = JSON.stringify(sTString);
			}
		});

		$scope.$watch('editing', function(editing) {
			original = _.extend(editing, {});
			$scope.tool = false;
		});

		$scope.$watch('editing.sirTrevor', function(val) {
			// Reinitialize Sir Trevor with some delay (enough to populate the model with new data)
			setTimeout(function() {
				SirTrevor.reinitialize($scope.sirTrevor);
			}, 20);

		});

		$scope.save = function() {

			// Trigger SirTrevor form submit 
			$scope.sirTrevor.onFormSubmit();

			// Fixed content type
			$scope.editing.type = 'Post';

			// Store content (SirTrevor data)
			$scope.editing.sections = $scope.sirTrevor.store.retrieve().data;

			if($scope.editing && $scope.editing._id) {

				Content.resource.update({contentId: $scope.editing._id}, $scope.editing, function(content) {

					original = _.extend(content, {});

					// Update editing content to saved data
					Content.edit(_.extend(content, {}));

					// Replace content in local features
					angular.forEach($scope.contents, function(c, i) {
						if(c._id == $scope.editing._id)
							$scope.contents[i] = $scope.editing;
					});
					Content.set($scope.contents);

					Message.message({
						status: 'ok',
						text: $translate.instant('Content saved')
					});

				});

			} else {

				$scope.editing.layer = layer._id;

				var content = new Content.resource($scope.editing);

				content.$save(function(content) {

					original = _.extend(content, {});

					// Locally push new content
					$scope.contents.push(content);
					Content.set($scope.contents);

					// Update editing content to saved data
					Content.edit(_.extend(content, {}));

					Message.message({
						status: 'ok',
						text: $translate.instant('Content published')
					});

				}, function(err) {

					var message = {status: 'error'};

					if(err.status == 400 && err.data.message) {
						message.text = err.data.message;
					} else {
						message.text = $translate.instant('Internal error');
					}

					Message.message(message, false);

				});

			}

		}

		$scope.delete = function() {

			if(confirm($translate.instant('Are you sure you want to remove this content?'))) {

				Content.resource.delete({contentId: $scope.editing._id}, function() {

					Content.set($scope.contents.filter(function(c) {
						return c._id !== $scope.editing._id;
					}));
					Content.edit(false);

					Message.message({
						status: 'ok',
						text: $translate.instant('Content removed')
					});

				}, function(err) {

					var message = {status: 'error'};

					if(err.status == 400 && err.data.message) {
						message.text = err.data.message;
					} else {
						message.text = $translate.instant('Internal error');
					}

					Message.message(message, false);
				});

			}

		}

		$scope.close = function() {

			if($scope.editing) {
				Content.edit(false);

				// Fix map size and bounds (animation safe)
				setTimeout(function() {
					MapService.fitFeatureLayer();
				}, 200);
			}

		}

		/*
		 * Features
		 */
		$scope.hasFeature = function(featureId) {
			if($scope.editing && $scope.editing.features) {
				return $scope.editing.features.filter(function(f) { return f == featureId }).length;
			}
			return false;
		}

		$scope.toggleFeature = function(featureId) {

			if(!$scope.editing.features)
				$scope.editing.features = [];

			var features = $scope.editing.features.slice(0);

			if($scope.hasFeature(featureId)) {
				features = features.filter(function(f) { return f !== featureId });
			} else {
				features.push(featureId);
			}

			$scope.editing.features = features;

		}

		$scope.clearFeatures = function() {

			$scope.editing.features = [];

		}

		/*
		 * Tools
		 */

		$scope.tool = false;

		$scope.setTool = function(tool) {
			if(tool == $scope.tool)
				$scope.tool = false;
			else
				$scope.tool = tool;
		}

		$scope.isRevertable = function() {

			return (!angular.equals($scope.editing, original) && $scope.editing && $scope.editing._id);

		}

		$scope.revert = function() {

			$scope.editing = _.extend(original, {});

		}

		$scope.$on('layerObjectChange', $scope.close);
		$scope.$on('$stateChangeStart', $scope.close);
		$scope.$on('layer.save.success', function() {

			if($scope.editing) {
				$scope.save(true);
			}

		});

	}
];