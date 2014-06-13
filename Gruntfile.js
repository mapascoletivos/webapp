var config = require('./app/config'),
	fs = require('fs'),
	_ = require('underscore');

module.exports = function(grunt) {

	var conf = {
		browserify: {
			js: {
				files: {
					'public/app.js': 'app/app.js',
					'public/lib/vendor.js': 'app/vendor.js'
				}
			}
		},
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: {
					'public/app.js': 'public/app.js',
					'public/lib/vendor.js': 'public/lib/vendor.js'
				}
			}
		},
		jade: {
			compile: {
				options: {
					doctype: "html"
				},
				files: [{
					expand: true,
					cwd: 'views',
					src: ['**/*.jade'],
					dest: 'public/views',
					ext: '.html'
				}]
			}
		},
		copy: {
			main: {
				files: [
					{ src: 'css/**', dest: 'public/' },
					{ src: 'img/**', dest: 'public/' },
					{ src: 'node_modules/maki/www/images/maki-sprite.png', dest: 'public/img/maki-sprite.png' },
					{ src: 'public/views/layouts/default.html', dest: 'public/index.html' }
				]
			}
		}
	};

	// Theme files
	if(config.theme && fs.existsSync('themes/' + config.theme)) {

		conf.jade.compile.files.push({
			expand: true,
			cwd: 'themes/' + config.theme + '/views',
			src: ['**/*.jade'],
			dest: 'public/views',
			ext: '.html'
		});

	}

	grunt.initConfig(conf);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');

	grunt.registerTask(
		'default', 
		'Compiles everything.', 
		['browserify', 'uglify', 'jade', 'copy' ]
	);

	grunt.registerTask(
		'scripts',
		'Compile scripts.',
		['browserify', 'uglify']
	);

	grunt.registerTask(
		'views',
		'Compile views.',
		['jade', 'copy']
	);

}