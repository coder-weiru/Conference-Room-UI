// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-02-24 using
// generator-karma 0.9.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
        'webapp/lib/angular/angular.js',
        'webapp/lib/angular-route/angular-route.js',
        'webapp/lib/angular-mocks/angular-mocks.js',
        'webapp/lib/jquery/dist/jquery.js',
        'webapp/lib/momentjs/moment.js',
        'webapp/lib/bootstrap/dist/js/bootstrap.js',
        'webapp/lib/fastclick/lib/fastclick.js',
        'webapp/lib/spin.js/spin.js',
        'webapp/lib/angular-spinner/angular-spinner.js',
        'webapp/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'webapp/lib/angular-ui-grid/ui-grid.js',
        'webapp/lib/angular-snap/angular-snap.js',
        'webapp/lib/snapjs/snap.js',
        'webapp/lib/jquery-ui/ui/jquery-ui.js',
        'webapp/lib/fullcalendar/dist/fullcalendar.js',
        'webapp/lib/angular-ui-calendar/src/calendar.js',
        'webapp/lib/angular-ui-bootstrap-datetimepicker/datetimepicker.js',
        'webapp/scripts/app.js',
        'webapp/scripts/services/msgbox_service.js',
        'webapp/scripts/services/spinner_service.js',        
        'webapp/scripts/services/useradmin_service.js',
        'webapp/scripts/services/roomadmin_service.js',
        'webapp/scripts/services/reservation_service.js',
        'webapp/scripts/controllers/useradmin_controller.js',
        'webapp/scripts/controllers/roomadmin_controller.js',
        'webapp/scripts/controllers/reservation_controller.js',
        'test/unit/jasmine_version_spec.js',
        'test/unit/services/**/*.js',
        'test/unit/controllers/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8989,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'Chrome'
    ],

    // Which plugins to enable
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    proxies: {
      '/': 'http://localhost:9000/'
    },
    // URL root prevent conflicts with the site root
    urlRoot: '_karma_'
  });
};
