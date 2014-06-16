var config = require('./app/config'),
	fs = require('fs');

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
		copy: {
			main: {
				files: [
					{ src: 'css/**', dest: 'public/' },
					{ src: 'img/**', dest: 'public/' },
					{ src: 'font/**', dest: 'public/' },
					{ src: 'node_modules/maki/www/images/maki-sprite.png', dest: 'public/img/maki-sprite.png' },
					{ expand: true, cwd: 'views', src: '**/*.jade', dest: 'tmp/views' }
				]
			}
		},
		jade: {
			compile: {
				options: {
					doctype: "html"
				},
				files: [{
					expand: true,
					cwd: 'tmp',
					src: ['**/*.jade'],
					dest: 'public',
					ext: '.html'
				}]
			}
		},
		clean: {
			build: {
				src: 'tmp'
			}
		}
	};

	// Theme tasks
	if(config.theme && fs.existsSync('themes/' + config.theme)) {

		var viewsDataPath = './themes/' + config.theme + '/views-data.js';

		if(fs.existsSync(viewsDataPath)) {
			conf.jade.compile.options.data = require(viewsDataPath);
		}

		conf.copy.main.files.push({
			expand: true,
			cwd: 'themes/' + config.theme + '/views',
			src: '**/*.jade',
			dest: 'tmp/views'
		});

		conf.copy.main.files.push({
			expand: true,
			cwd: 'themes/' + config.theme + '/public',
			src: '**',
			dest: 'public'
		});

	}

	// Create index
	//conf.copy.main.files.push({ src: 'tmp/views/layouts/default.jade', dest: 'tmp/index.jade' });

	grunt.initConfig(conf);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask(
		'default', 
		'Compiles everything.', 
		['browserify', 'uglify', 'copy', 'jade', 'clean' ]
	);

	grunt.registerTask(
		'scripts',
		'Compile scripts.',
		['browserify', 'uglify']
	);

	grunt.registerTask(
		'views',
		'Compile views.',
		['copy', 'jade', 'clean']
	);

}