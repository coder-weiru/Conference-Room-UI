/**
 * UserAdminController
 */
var userModule = angular.module('controller.userAdmin', [ 'service.userAdmin', 'ui.grid' ]);

userModule.controller('UserListCtrl', function($scope, UserAdminService) {
	$scope.columns = [{ name: ' ',
                        cellTemplate: '<img ng-src="images/headshot-empty.jpg"/>',
                        cellClass: 'ngCellText',
                        width: 100,
                        enableHiding: false,
                        enableSorting: false,
                        enableColumnMenu: false
                      }, 
                      { field: 'name',
                        cellClass: 'ngCellText',
                      }, 
                      { field: 'email', 
                        cellClass: 'ngCellText',
                      }, 
                      { field: 'group',
                        cellClass: 'ngCellText',
                      }];
    
    $scope.gridOptions = {
        rowHeight:130,
        enableRowSelection: true, 
        enableRowHeaderSelection: false,
        enableSorting: true,
        columnDefs: $scope.columns,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
        }
    };
	$scope.users = [];
    
	$scope.listUsers = function() {
		UserAdminService.listUsers().then(function(users) {
			$scope.users = users;
            $scope.gridOptions.data = $scope.users;
		});
	};
	
    
	$scope.listUsers();
	
});
