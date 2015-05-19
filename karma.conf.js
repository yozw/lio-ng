// Karma configuration
// Generated on Tue Mar 11 2014 19:52:39 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({

    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'test/init.js',
      'src/lib/jquery/jquery-2.1.0.min.js',
      'src/lib/jqplot/jquery.jqplot.js',
      'src/lib/angular/angular.js',
      'src/lib/angular/angular-mocks.js',
      'src/lib/angular/angular-cookies.js',
      'src/lib/angular/angular-sanitize.js',
      'src/lib/marked/angular-marked.js',
      'src/lib/glpk/glpk.js',
      'src/lib/ace/ace.js',
      'src/lib/ui-bootstrap/ui-bootstrap.js',
      'src/lib/ui-chart/chart.js',
      'src/lib/ui-grid/ui-grid-stable.js',
      'src/application/application.js',
      'src/application/ace/*.js',
      'src/application/common/*.js',
      'src/application/directives/*.js',
      'src/application/directives/results/*.js',
      'src/application/jqplot/*.js',
      'src/application/services/*.js',
      'src/application/workers/math/*.js',
      'src/application/workers/tables/*.js',
      'src/application/workers/*.js',
      'test/**/*.Test.js',
//      'test/workers/*.Test.js',

      { pattern: './src/**/*', included: false }
    ],


    // list of files to exclude
    exclude: [
      
    ],

    proxies:  {
      '/lib': 'http://localhost:9876/base/src/lib',
      '/application': 'http://localhost:9876/base/src/application'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
