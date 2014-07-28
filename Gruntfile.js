module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		requirejs: {
		    compile: {
		      	options: {
		      		baseUrl:"bower_components",
		      		paths: {
		      			"jquery":"empty:"
		      		},
		      		name: "../src/js/TigerWoodsScorecardApp",
		        	out: "bin/js/TigerWoodsScorecardApp.js"
		      	}
		    }
	  	},

	  	copy: {
		  main: {
		  	expand: true,
		    cwd: 'src/css/',
		    src: '**',
		    dest: 'bin/css/'
		  }
		}		
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['requirejs', 'copy']);
};