module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      css: {
        files: ['**/sass/*.sass'],
        tasks: ['sass', 'autoprefixer'],
      },
      scripts: {
        files: ['scripts/src/*.js', 'scripts/src/lib/*.js'],
        tasks: ['babel', 'browserify'],
        options: {
          spawn: false,
        },
      },
    },

    browserify: {
      dist: {
        files: [{
          expand: true,       // Enable dynamic expansion.
          cwd: 'scripts/dist/babel/',        // Src matches are relative to this path.
          src: ['**/*.js'],  // Actual pattern(s) to match.
          dest: 'scripts/dist/',      // Destination path prefix.
          ext: '.js',     // Dest filepaths will have this extension.
          extDot: 'first'     // Extensions in filenames begin after the first dot
      }]
      },
    },

    babel: {
      options: {
        sourceMap: false,
        presets: ['env'],
      },
      dist: {
        files: [{
          expand: true,       // Enable dynamic expansion.
          cwd: 'scripts/src/',        // Src matches are relative to this path.
          src: ['**/*.js'],  // Actual pattern(s) to match.
          dest: 'scripts/dist/babel',      // Destination path prefix.
          ext: '.js',     // Dest filepaths will have this extension.
          extDot: 'first'     // Extensions in filenames begin after the first dot
      }]
      },
    },

    autoprefixer: {
      single_file: {
        src: 'styles/css/master.css',
        dest: 'styles/css/master.css',
      },
    },

    sass: {
      options: {
        style: 'expanded',
      },
      dist: {
        files: {
          'styles/css/master.css': 'styles/sass/style.sass',
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['babel']);
  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('default', ['autoprefixer']);
  grunt.registerTask('default', ['sass']);
  grunt.registerTask('default', ['watch']);
};
