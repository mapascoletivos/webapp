var config = require("./app/config"),
  fs = require("fs");

module.exports = function(grunt) {
  var conf = {
    browserify: {
      js: {
        files: {
          "public/app.js": "tmp/app/app.js",
          "public/lib/vendor.js": "tmp/app/vendor.js"
        }
      }
    },
    uglify: {
      build: {
        options: {
          mangle: true,
          compress: {}
        },
        files: {
          "public/app.js": "public/app.js",
          "public/lib/vendor.js": "public/lib/vendor.js"
        }
      }
    },
    less: {
      compile: {
        files: {
          "public/css/app.css": "css/app.less"
        }
      }
    },
    copy: {
      main: {
        files: [
          { src: ["css/**", "!css/**/*.less"], dest: "public/" },
          { src: "img/**", dest: "public/" },
          { src: "font/**", dest: "public/" },
          {
            src: "node_modules/maki/www/images/maki-sprite.png",
            dest: "public/img/maki-sprite.png"
          },
          { expand: true, cwd: "views", src: "**/*.jade", dest: "tmp/views" },
          { expand: true, cwd: "app", src: "**/*.js", dest: "tmp/app" }
        ]
      }
    },
    jade: {
      compile: {
        options: {
          doctype: "html"
        },
        files: [
          {
            expand: true,
            cwd: "tmp",
            src: ["**/*.jade"],
            dest: "public",
            ext: ".html"
          }
        ]
      }
    },
    clean: {
      build: {
        src: "tmp"
      }
    },
    watch: {
      options: { livereload: true },
      scripts: {
        files: "app/**/*.js",
        tasks: ["copy", "browserify"]
      },
      jade: {
        files: "views/**/*.jade",
        tasks: ["copy", "jade"]
      },
      css: {
        files: "css/**/*.less",
        tasks: ["less"]
      }
    }
  };

  // Theme tasks
  if (config.theme && fs.existsSync("themes/" + config.theme)) {
    var viewsDataPath = "./themes/" + config.theme + "/views-data.js";

    if (fs.existsSync(viewsDataPath)) {
      conf.jade.compile.options.data = require(viewsDataPath);
    }

    conf.copy.theme = {
      files: [
        {
          expand: true,
          cwd: "themes/" + config.theme + "/app",
          src: "**/*.js",
          dest: "tmp/app"
        },
        {
          expand: true,
          cwd: "themes/" + config.theme + "/views",
          src: "**/*.jade",
          dest: "tmp/views"
        },
        {
          expand: true,
          cwd: "themes/" + config.theme + "/public",
          src: "**",
          dest: "public"
        }
      ]
    };
  }

  // Create index
  //conf.copy.main.files.push({ src: 'tmp/views/layouts/default.jade', dest: 'tmp/index.jade' });

  grunt.initConfig(conf);

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.registerTask("javascript", "Compile scripts.", ["browserify"]);

  grunt.registerTask("views", "Compile views.", ["jade", "clean", "less"]);

  grunt.registerTask("build", "Build everything", [
    "copy",
    "javascript",
    "views"
  ]);

  grunt.registerTask("default", "Compiles everything.", ["build", "watch"]);
};
