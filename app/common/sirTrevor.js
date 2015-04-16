'use strict';

require('../content/sirtrevor-blocks/yby-image-block.js')

/*
 * Sir Trevor
 */

angular.module('yby.sirTrevor', [])

.directive('sirTrevorEditor', [
	'apiPrefix',
	function(apiPrefix) {
		return {
			link: function(scope, element, attrs) {
				SirTrevor.setDefaults({
					uploadUrl: apiPrefix + '/images',
					uploadedImagesUrl: window.ybySettings.general.cdnUrl + '/images'
				});
				scope.sirTrevor = new SirTrevor.Editor({
					el: jQuery(element),
					blockTypes: [
						'Embedly',
						'Text',
						'List',
						'YbyImage',
						'Video'
					],
					defaultType: 'Text',
					required: 'Text'
				});
			}
		}
	}
])
.factory('SirTrevor', [
	function() {

		// Providers regex from SirTrevor's video block code
		var videoProviders = {
			vimeo: {
				regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo.com\/(.+)/,
				html: "<iframe src=\"{{protocol}}//player.vimeo.com/video/{{remote_id}}?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
			},
			youtube: {
				regex: /(?:http[s]?:\/\/)?(?:www.)?(?:(?:youtube.com\/watch\?(?:.*)(?:v=))|(?:youtu.be\/))([^&].+)/,
				html: "<iframe src=\"{{protocol}}//www.youtube.com/embed/{{remote_id}}\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
			}
		};

		return {
			destroy: function(editor) {
				// Destroy the rendered sub views
				editor.formatBar.destroy();
				editor.fl_block_controls.destroy();
				editor.block_controls.destroy();

				// Destroy all blocks
				editor.block_manager.blocks.forEach(function(block) {
					this.mediator.trigger('block:remove', block.blockID);
				}, editor);

				// Stop listening to events
				editor.mediator.stopListening();
				editor.stopListening();

				// Remove instance
				SirTrevor.config.instances = SirTrevor.config.instances.filter(function(instance) {
					return instance.ID !== editor.ID;
				}, editor);

				// Clear the store
				editor.store.reset();
				editor.$outer.replaceWith(editor.$el.detach());
			},
			reinitialize: function(editor, options) {
				this.destroy(editor);
				editor.initialize(options || editor.options);
			},
			render: function(blocks) {
				var self = this;
				var rendered = '';
				angular.forEach(blocks, function(block) {
					rendered += self.renderBlock(block);
				});
				return rendered;
			},
			renderBlock: function(block) {
				var rendered = '';
				if(typeof block !== 'undefined' && block) {
					switch(block.type) {
						case 'text':
							rendered += '<div class="text">' + markdown.toHTML(block.data.text) + '</div>';
							break;
						case 'list':
							rendered += '<div class="list">' + markdown.toHTML(block.data.text) + '</div>';
							break;
						case 'yby_image':
							var cdnUrl = window.ybySettings.general.cdnUrl;
							rendered += '<div class="image"><img src="'+ cdnUrl + '/images/' + block.data.files.default + '" /></div>';
							break;
						case 'video':
							rendered += '<div class="video" fit-vids>' + videoProviders[block.data.source].html
								.replace('{{protocol}}', window.location.protocol)
								.replace('{{remote_id}}', block.data.remote_id) + '</div>';
							break;
					}
				}
				return rendered;
			}
		}
	}
]);