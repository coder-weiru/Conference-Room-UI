// Generated on 2015-02-24 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

	var path = require('path');

	// Configurable paths for the application
	var appConfig = {
		app: require('./bower.json').appPath || 'webapp',
		dist: 'dist',
        maven: 'dist'
	};
	
    // Project configuration.
    grunt.initConfig({
 
		// Project settings
		yeoman: appConfig,

 		pkg: grunt.file.readJSON('package.json'),
		
        bower: {
		    dev: {
                dest: './webapp/lib',
                css_dest: './webapp/lib',
                options: {
                    expand: true,
                    packageSpecific: {
                        bootstrap: {
                          files: [
                            "dist/fonts/glyphicons-halflings-regular.*",
                            "dist/css/*.*"  
                          ]
                        }
                    }
                }
            }
		},

		concat: {
			options: {
				eparator: ';'
			},
			dist: {
                files: {
                  './webapp/scripts/app.js': [
                     './webapp/scripts/**/*.js'
                   ]
                }
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

		karma: {
			unit: {
				configFile: 'test/karma.conf.js',
				autoWatch: true
			}
		},

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
		
		uglify: {
			dist: {
				src: 'merged.js',
				dest: 'build/merged.min.js'
			}
		},	
		    
        /*
         * Build a WAR (web archive) without Maven or the JVM installed.
         */
        war: {
            target: {
              options: {
                war_verbose: true,
                war_dist_folder: 'dist',           /* Folder where to generate the WAR. */
                war_name: 'CR-UI',                  /* The name fo the WAR file (.war will be the extension) */
                webxml_welcome: 'index.html',
                webxml_display_name: 'Conference Room UI',
                webxml_mime_mapping: [ 
                    { 
                        extension: 'woff', 
                        mime_type: 'application/font-woff' 
                    } ]  
            },
            files: [
                {
                  expand: true,
                  cwd: 'webapp',
                  src: ['**'],
                  dest: ''
                }
              ]
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-bower');	
    grunt.loadNpmTasks('grunt-war');
    
	// Default task.
	grunt.registerTask('default', ['karma','jshint','concat','uglify']);
    // Karma test task
    grunt.registerTask('test', ['jshint','karma']);
};
