'use strict';

var appModule = angular.module('MainApp', ['controller.userAdmin', 'ngRoute']);

appModule.run(function($rootScope, $http, $window, $q, $location) {

    document.addEventListener("deviceready", function () {
        FastClick.attach(document.body);
        StatusBar.overlaysWebView(false);
    }, false);

});

appModule.controller('MainCtrl', function($scope, $routeParams) {
    
    $scope.dashboardUrl = 'views/user_admin.html';
	$scope.showMenu = true;

    var init = function () {
    
        if ($routeParams.routeId) {
            if ($routeParams.routeId==1) {
                $scope.setDashboardUrl('user_admin');
            }
            else if ($routeParams.routeId==2) {
                $scope.setDashboardUrl('user_admin');
            }
            else if ($routeParams.routeId==3) {
                $scope.setDashboardUrl('user_admin');
            }
        }
    };

    // fire on controller loaded
    init();

    $scope.setDashboardUrl = function(dashboard) {
        $scope.dashboardUrl = 'views/' + dashboard + '.html';
    };

    $scope.getDashboardUrl = function() {
        return $scope.dashboardUrl;
    };

    $scope.toggleMenu = function () {
        $scope.showMenu = !$scope.showMenu;
    }

    $scope.setDashboardUrl('user_admin');
});

appModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dashboard/:routeId', {
        templateUrl: 'views/user_admin.html',
        controller: 'MainCtrl'
      }).
      otherwise({
        redirectTo: '/dashboard/1'
      });
}]);