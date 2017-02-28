/*

				npm install grunt --save-dev

				npm install grunt-contrib-watch --save-dev
				npm install grunt-contrib-sass --save-dev
				npm install grunt-contrib-cssmin --save-dev
				npm install grunt-contrib-concat --save-dev
				npm install grunt-contrib-uglify --save-dev

*/

module.exports = function( grunt ) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		concat: {
			appjs: {
	      src: [
					'lib/jquery-3.1.1.min.js',
					'lib/tether-1.3.3/dist/js/tether.min.js',
					'lib/bootstrap-4.0.0-alpha.6/dist/js/bootstrap.min.js',
					'lib/slick-1.6.0/slick/slick.min.js',
					'js/*.js'
				],
	      dest: '_temp/app.js',
	    },
	    appscss: {
	      src: [
					'scss/variables.scss',
					'scss/lib.scss',
					'scss/mixins.scss',
					'scss/utilities.scss',
					'scss/app.scss',
					'scss/components/*.scss',
					'scss/pages/*.scss'
				],
	      dest: '_temp/app.scss',
	    }
		},
		sass: {                              // Task
			dist: {                            // Target
				options: {                       // Target options
					style: 'expanded'
				},
				files: {                         // Dictionary of files
					'_temp/app.css': '_temp/app.scss'
				}
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1,
				keepSpecialComments: 1
			},
			target: {
				files: {
					'../resources/app.min.css':  ['_temp/app.css']
				}
			}
		},
		uglify: {
	    my_target: {
	      files: {
	        '../resources/app.min.js': ['_temp/app.js']
	      }
	    }
	  }
	});
	grunt.registerTask('default', ['concat','sass','cssmin','uglify']);
};
