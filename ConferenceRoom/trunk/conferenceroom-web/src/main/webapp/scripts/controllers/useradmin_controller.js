/**
 * UserAdminController
 */
var userModule = angular.module('controller.userAdmin', [ 'service.userAdmin',  'service.userPhoto', 'service.messageBox', 'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav']);

userModule.controller('UserListCtrl', function($scope, $log, UserAdminService, UserPhotoModalService, MessageBoxService) {
    
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
                        enableColumnMenu: false,
                        enableCellEdit: false
                      }, 
                      { field: 'name',
                        cellClass: 'ngCellText',
                        enableCellEdit: true
                      }, 
                      { field: 'email', 
                        cellClass: 'ngCellText',
                        enableCellEdit: true
                      }, 
                      { field: 'group',
                        cellClass: 'ngCellText',
                        enableCellEdit: true
                      }];
    
    $scope.gridOptions = {
        rowHeight:130,
        enableRowSelection: true, 
        enableRowHeaderSelection: false,
        enableSorting: true,
        enableCellEditOnFocus: true,
        columnDefs: $scope.columns,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
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
    
    $scope.saveRow = function( rowEntity ) {
        var promise = UserAdminService.updateUser( rowEntity );
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
        
        promise.then(function(response) {
			var data = response.data;                   
			if (data.httpStatus == 'OK') {
			    $scope.errorMessage = 'User information is saved successfully!';
		    } else {
		    	$scope.errorMessage = 'Oops, we received your request, but there was an error processing it.';
                $scope.openErrorMessageModalDialog('Error while updating user', $scope.errorMessage);
		    }
            $log.error(data);
		}, function(response) {
            var data = response.data;                   
			if (data.httpStatus == 'BAD_REQUEST') {
			    $scope.errorMessage = response.data.message;
                $scope.openErrorMessageModalDialog('Error while updating user', $scope.errorMessage);
		    } else {
		    	$scope.errorMessage = 'There was a network error. Try again later.';
                $scope.openErrorMessageModalDialog('Error while updating user', $scope.errorMessage);
		    }
		    $log.error(data);
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
    
    $scope.users = [];
    
	$scope.listUsers = function() {
		UserAdminService.listUsers().then(function(users) {
			$scope.users = users;
            $scope.gridOptions.data = $scope.users;
		});
	};
	
	$scope.listUsers();
	
});
