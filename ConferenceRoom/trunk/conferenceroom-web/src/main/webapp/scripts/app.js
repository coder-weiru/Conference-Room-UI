'use strict';

var appModule = angular.module('MainApp', ['controller.userAdmin', 'controller.roomAdmin', 'snap', 'ngRoute', 'flow']);

appModule.run(function($rootScope, $http, $window, $q, $location) {

    document.addEventListener("deviceready", function () {
        FastClick.attach(document.body);
        StatusBar.overlaysWebView(false);
    }, false);

});

appModule.controller('MainCtrl', function($scope, $routeParams) {
    
    $scope.showMenu = true;

    $scope.toggleMenu = function () {
        $scope.showMenu = !$scope.showMenu;
    }

    $scope.snapOptions = {
        disable: 'right'
    };
});

appModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dashboard/1', {
        templateUrl: 'views/partials/reservations.html',
        controller: 'MainCtrl'
      }).
      when('/dashboard/2', {
        templateUrl: 'views/partials/room_admin.html',
        controller: 'MainCtrl'
      }).
      when('/dashboard/3', {
        templateUrl: 'views/partials/user_admin.html',
        controller: 'UserListCtrl'
      }).
      otherwise({
        redirectTo: '/dashboard/1'
      });
}]);

/*
appModule.config(['flowFactoryProvider',
  function (flowFactoryProvider) {
	  flowFactoryProvider.defaults = {
	    target: 'upload.php',
	    permanentErrors: [404, 500, 501],
	    maxChunkRetries: 1,
	    chunkRetryInterval: 5000,
	    simultaneousUploads: 4,
	    singleFile: true
	  };
	  flowFactoryProvider.on('catchAll', function (event) {
	    console.log('catchAll', arguments);
	  });
	  // Can be used with different implementations of Flow.js
	  // flowFactoryProvider.factory = fustyFlowFactory;
}]);
*/
