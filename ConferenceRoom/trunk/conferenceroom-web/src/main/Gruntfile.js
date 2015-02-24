// Generated on 2015-02-24 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

	// Configurable paths for the application
	var appConfig = {
		app: require('./bower.json').appPath || 'webapp',
		dist: 'dist'
	};
	
    // Project configuration.
    grunt.initConfig({
 
		// Project settings
		yeoman: appConfig,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
		  bower: {
			files: ['bower.json'],
			tasks: ['wiredep']
		  },
		  js: {
			files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
			tasks: ['newer:jshint:all'],
			options: {
			  livereload: '<%= connect.options.livereload %>'
			}
		  },
		  jsTest: {
			files: ['test/spec/{,*/}*.js'],
			tasks: ['newer:jshint:test', 'karma']
		  },
		  styles: {
			files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
			tasks: ['newer:copy:styles', 'autoprefixer']
		  },
		  gruntfile: {
			files: ['Gruntfile.js']
		  },
		  livereload: {
			options: {
			  livereload: '<%= connect.options.livereload %>'
			},
			files: [
			  '<%= yeoman.app %>/{,*/}*.html',
			  '.tmp/styles/{,*/}*.css',
			  '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
			]
		  }
		},		
		jshint:{
			all:['scripts.js']
		},
		concat: {
			dist: {
				src: ['scripts.js', 'scripts1.js','scripts2.js'],
				dest: 'merged.js'
				}
		},
		uglify: {
			dist: {
				src: 'merged.js',
				dest: 'build/merged.min.js'
			}
		},	
		// Empties folders to start fresh
		clean: {
		  dist: {
			files: [{
			  dot: true,
			  src: [
				'.tmp',
				'<%= yeoman.dist %>/{,*/}*',
				'!<%= yeoman.dist %>/.git{,*/}*'
			  ]
			}]
		  },
		  server: '.tmp'
		},
		copy: {
		  dist: {
			files: [{
			  expand: true,
			  dot: true,
			  cwd: '<%= yeoman.app %>',
			  dest: '<%= yeoman.dist %>',
			  src: [
				'*.{ico,png,txt}',
				'.htaccess',
				'*.html',
				'views/{,*/}*.html',
				'images/{,*/}*.{webp}',
				'styles/fonts/{,*/}*.*'
			  ]
			}, {
			  expand: true,
			  cwd: '.tmp/images',
			  dest: '<%= yeoman.dist %>/images',
			  src: ['generated/*']
			}, {
			  expand: true,
			  cwd: 'bower_components/bootstrap/dist',
			  src: 'fonts/*',
			  dest: '<%= yeoman.dist %>'
			}]
		  },
		  styles: {
			expand: true,
			cwd: '<%= yeoman.app %>/styles',
			dest: '.tmp/styles/',
			src: '{,*/}*.css'
		  }
		}	
    });

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// Default task.
	grunt.registerTask('default', ['jshint','concat','uglify']);
};
