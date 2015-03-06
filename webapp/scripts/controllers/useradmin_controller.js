/**
 * UserAdminController
 */
var userModule = angular.module('controller.userAdmin', [ 'service.userAdmin',  'service.userPhoto', 'ui.grid' ]);

userModule.controller('UserListCtrl', function($scope, UserAdminService, UserPhotoModalService) {
    
    $scope.photo = function(val) {
        var photoUrl = "images/headshot-empty.jpg";
        if (val != null && (val.search("http") >=0 || val.search("https") >=0)) {
            photoUrl = val;  
        }
        return photoUrl;
    };

    $scope.columns = [{ name: ' ',
                        cellTemplate: '<img ng-src="{{grid.appScope.photo(row.entity.photoUrl)}}" alt="{{row.entity.name}}" class="gallery-image fade-animation" ng-click="grid.appScope.openPhotoUploadModalDialog(row.entity)" />',
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
	
    var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Upload picture file...',
        headerText: 'Upload Headshot Photo',
        bodyText: 'Please select a headshot picture file to upload.'
    };

    $scope.openPhotoUploadModalDialog = function(user) {
		UserPhotoModalService.showModal({}, modalOptions).then(function (result) {
            console.log(result);
        });
	};
    
	$scope.listUsers();
	
});
