// =============================================================================
// Mathigon | Grunt Configuration
// (c) 2016 Mathigon
// =============================================================================


var grunt = require('grunt');

grunt.initConfig({

    // -------------------------------------------------------------------------
    // CSS

    less: {
        options: {
            compress: true,
            optimisation: 1,
            banner: '/* (c) 2016, Mathigon */\n'
        },
        app: {
            files: [{
                expand: true,
                src: ['assets/**/*.less', 'exhibits/**/*.less'],
                dest: 'build/',
                ext: '.css'
            }]
        }
    },

    autoprefixer: {
        app: {
            files: [{
                expand: true,
                src: 'build/**/*.css'
            }]
        }
    },

    // -------------------------------------------------------------------------
    // JavaScript

    babel: {
        options: {
            presets: ['es2015-loose']
        },
        app: {
            files: [{
                expand: true,
                src: ['assets/**/*.js', 'exhibits/**/*.js'],
                dest: 'build/'
            }]
        }
    },

    uglify: {
        options: {
            banner: '/* (c) 2016, Mathigon */\n',
            // sourceMap: false,
            mangle: true
        },
        app: {
            files: [{
                expand: true,
                src: ['build/**/*.js', '!build/assets/polyfill.js']
            }]
        }
    },

    concat: {
        vendor: {
            src: [
                'node_modules/babel-polyfill/dist/polyfill.min.js',
                'node_modules/socket.io-client/socket.io.js'
            ],
            dest: 'build/assets/polyfill.js'
        }
    },

    // -------------------------------------------------------------------------
    // General

    clean: {
        app: ['build']
    },

    copy: {
        app: {
            files: [{
                expand: true,
                src: '**/*.{gif,png,jpg,webp,ico,json,mp3,mp4,eot,svg,ttf,woff,pdf,txt}',
                cwd: 'assets',
                dest: 'build'
            }]
        }
    }
});

require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

grunt.registerTask('build', ['clean', 'concat', 'less', 'autoprefixer', 'copy']);
grunt.registerTask('default', ['build', 'babel', 'uglify']);
module.exports = grunt;
