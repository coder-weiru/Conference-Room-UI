/**
 * UserAdminController
 */
var userModule = angular.module('controller.userAdmin', [ 'service.userAdmin' ]);

userModule.controller('UserListCtrl', function($scope, UserAdminService) {
	
	$scope.users = [];
    
	$scope.listUsers = function() {
		UserAdminService.lisUsers().then(function(users) {
			$scope.users = users;
		});
	};
	
	$scope.listUsers();
	
});