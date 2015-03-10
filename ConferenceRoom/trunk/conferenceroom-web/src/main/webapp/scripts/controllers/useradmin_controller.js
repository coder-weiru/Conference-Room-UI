/**
 * UserAdminController
 */
var userModule = angular.module('controller.userAdmin', [ 'service.userAdmin',  'service.userPhoto', 'service.messageBox', 'ui.grid', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav']);

userModule.controller('UserListCtrl', function($scope, $log, $timeout, UserAdminService, UserPhotoModalService, MessageBoxService) {
    
    $scope.getPhotoUrl = function( rowEntity ) {
        var photoUrl = rowEntity.photoUrl;
        if (photoUrl == null || photoUrl.search("http") < 0 || photoUrl.search("https") < 0) {
            photoUrl = "images/blank-profile-head.png";
        }
        return photoUrl;
    };
    
    $scope.columns = [{ name: 'photo',
                        displayName: '',
                        cellTemplate: '<img ng-src="{{grid.appScope.getPhotoUrl(row.entity)}}" alt="{{row.entity.name}}" class="gallery-image fade-animation"/>',
                        width: 100,
                        enableHiding: false,
                        enableSorting: false,
                        enableColumnMenu: false,
                        enableCellEdit: false
                      }, 
                      { field: 'name',
                        enableCellEdit: true
                      }, 
                      { field: 'email', 
                        enableCellEdit: true
                      }, 
                      { field: 'group',
                        enableCellEdit: true
                      }];
    
    $scope.gridOptions = {
        rowHeight:70,
        enableRowSelection: true, 
        enableRowHeaderSelection: true,
        selectionRowHeaderWidth: 35,
        enableSelectAll: true,
        multiSelect: false,
        noUnselect: false,
        showGridFooter: true,
        enableSorting: true,
        enableCellEditOnFocus: true,
        columnDefs: $scope.columns,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.rowEdit.on.saveRow($scope, $scope.saveRow); 
          $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row) { 
            if (row.isSelected) {
              $scope.selectedUser = row.entity;  
            } else {
              $scope.selectedUser = null;
            }
            $log.log($scope.selectedUser);
          });
        }
    };
 
    var fileUploadModalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Upload picture file...',
        headerText: 'Upload Headshot Photo',
        bodyText: 'Please select a headshot picture file to upload.'
    };

    $scope.openPhotoUploadModalDialog = function( rowEntity ) {
		UserPhotoModalService.showModal({}, fileUploadModalOptions).then(function (result) {
            console.log(result);
        });
	  };
    
    $scope.saveRow = function( rowEntity ) { debugger;
        if (rowEntity!=null && rowEntity.id==null) {
			promise = UserAdminService.addUser( rowEntity );
		} else {
			promise = UserAdminService.updateUser( rowEntity );
		}
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
        
        promise.then(function(response) { debugger;
			var data = response.data;                   
			if (response.statusText == 'OK') {
			    $scope.errorMessage = 'User information is saved successfully!';
		    } else {
		    	$scope.errorMessage = 'Oops, we received your request, but there was an error processing it.';
                $scope.openErrorMessageModalDialog('Error while updating user', $scope.errorMessage);
		    }
		}, function(response) { debugger;
            var data = response.data;                   
			if (data.httpStatus == 'BAD_REQUEST' || data.httpStatus == 'INTERNAL_SERVER_ERROR') {
			    $scope.errorMessage = response.data.message;
                $scope.openErrorMessageModalDialog('Error while updating user', $scope.errorMessage);
		    } else {
		    	$scope.errorMessage = 'There was a network error. Try again later.';
                $scope.openErrorMessageModalDialog('Error while updating user', $scope.errorMessage);
		    }
		});
        
    }; 
 
    var messageBoxModalOptions = {
            actionButtonText: '  Got It ',
            headerText: '',
            bodyText: ''
    };
    
    $scope.openErrorMessageModalDialog = function( header, message ) {
        messageBoxModalOptions.headerText = header;
        messageBoxModalOptions.bodyText = message;                                                              
        MessageBoxService.showModal({}, messageBoxModalOptions).then(function (result) {
            console.log(result);
        });
	}; 
    
    $scope.listUsers = function() {
		UserAdminService.listUsers().then(function(users) {
			$scope.gridOptions.data = users;
		});
	};
	
    $scope.addUser = function( user ) {
		$scope.gridOptions.data.unshift( user );
        $scope.gridApi.rowEdit.flushDirtyRows( $scope.gridApi.grid );
        $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
	};
	
    $scope.selectedUser;
    $scope.listUsers();
	
});

userModule.controller('MenuCtrl', function ($scope, $log) {
    $scope.canAddNewUser = function() {
        //return $scope.selectedUser!=null;
        return true;
    };

    $scope.canUploadPhoto = function() {
        return $scope.selectedUser!=null;
    };

    $scope.canDeleteUser = function() {
        return $scope.selectedUser!=null;
    };
    
    $scope.addNewUser = function() {
		var user = {};
		user.name = 'New User';
		user.email = 'New User Email';
		user.group = false;
        user.photoUrl = ' ';
                                    
		$scope.addUser(user);
	};
});
