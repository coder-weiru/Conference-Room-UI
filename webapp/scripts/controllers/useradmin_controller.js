'use strict';
/**
 * UserAdminController
 */
var userModule = angular.module('controller.userAdmin', [ 'service.userAdmin', 'service.messageBox', 'ui.grid', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav', 'ui.bootstrap']);

userModule.controller('UserListCtrl', function($scope, $log, $timeout, $modal, $msgbox, UserAdminService) {
    
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
                        enableCellEdit: true,
                        footerCellTemplate: '<div class="ui-grid-bottom-panel" style="text-align: center">Total Rows : {{grid.appScope.gridOptions.data.length}}</div>'
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
        showColumnFooter: true,
        enableSorting: true,
        enableCellEditOnFocus: true,
        columnDefs: $scope.columns,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.rowEdit.on.saveRow($scope, $scope.saveUser); 
          $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row) { 
            if (row.isSelected) {
              $scope.selectedUser = row.entity;  
            } else {
              $scope.selectedUser = null;
            }
            $log.log($scope.gridApi.selection.getSelectedRows());
            $log.log($scope.selectedUser);
          });
        }
    };
    
    $scope.listUsers = function() {
		UserAdminService.listUsers().then(function(users) {
			$scope.gridOptions.data = users;
		});
	};
	
    $scope.findUser = function( text ) { 
        UserAdminService.findUser( text ).then(function( users ) {
            $scope.gridOptions.data = users;
        });
    }; 
    
    $scope.saveUser = function( user ) { 
        var promise;
        if (user!=null && user.id==null) {
			promise = UserAdminService.addUser( user );
		} else {
			promise = UserAdmnService.updateUser( user );
		}
        $scope.gridApi.rowEdit.setSavePromise( user, promise );
        
        promise.then(function(response) { 
			var data = response.data;                   
			if (response.statusText == 'OK') {
			    $scope.$broadcast('userSaved', data);
		    } else {
		    	$scope.showMessage('Oops, we received your request, but there was an error processing it.');
                $msgbox.showErrorMessage('Oops, we received your request for saving ' + $scope.selectedUser.name + ' , but there was an error processing it.');
                $scope.$broadcast('userSaveErr', user);
		    }
		}, function(response) { 
            var data = response.data;                   
			if (data.httpStatus == 'BAD_REQUEST' || data.httpStatus == 'INTERNAL_SERVER_ERROR') {
			    $msgbox.showErrorMessage(response.data.message);
		    } else {
		    	$msgbox.showErrorMessage('There was a network error while saving  ' + $scope.selectedUser.name + '. Try again later.');
		    }
            $scope.$broadcast('userSaveErr', user);
		});
        
    };
    
    $scope.getUser = function( user ) { 
        if (user!=null && user.id!=null) {
			UserAdminService.getUser(user.id).then(function( data ) {
                $scope.originalUser = data;  
            });
		} 
    }; 
    
    $scope.addUser = function( user ) { 
        $scope.gridOptions.data.unshift( user );
        $scope.selectUser( $scope.gridOptions.data[0] );
	};
	
    $scope.selectUser = function( user ) {  
        $timeout(function () {
            $scope.gridApi.selection.selectRow( user );
          },
        10);
    };
    
    $scope.unSelectUser = function( user ) {  
        $timeout(function () {
            $scope.gridApi.selection.toggleRowSelection( user );
          },
        10);
    };
    
    $scope.removeUser = function( user ) { 
        if (user!=null && user.id!=null) {
			UserAdminService.deleteUser(user.id).then(function( data ) {
                $scope.$broadcast('userDeleted', data); 
            });
		} 
    }; 
    
    $scope.$on('userSaved', function(event, user) {  
        $scope.gridOptions.data[0] = user;   
        $scope.selectUser( $scope.gridOptions.data[0] ); 
        $scope.originalUser = null;
    });
     
    $scope.$on('userSaveErr', function(event, user) {  
        $scope.selectUser( user ); 
        $scope.getUser( user );
    });
    
    $scope.$on('userDeleted', function(event, user) {  
        $scope.unSelectUser( user );
        for (var i = 0; i < $scope.gridOptions.data.length; i++) { 
            if ($scope.gridOptions.data[i].id == user.id) { 
                $scope.gridOptions.data.splice(i,1);
                break;
            }
        }
    });
    
    $scope.originalUser;
    $scope.selectedUser;
    $scope.listUsers();
	
});

userModule.controller('MenuCtrl', function ($scope, $log, $modal, $msgbox) {
    $scope.canAddNewUser = function() {
        return $scope.selectedUser==null;
    };

    $scope.canUploadPhoto = function() {
        return $scope.selectedUser!=null;
    };

    $scope.canDeleteUser = function() {
        return $scope.selectedUser!=null && $scope.selectedUser.id!=null;
    };
    
    $scope.canRevertUser = function() { 
        return $scope.originalUser!=null && $scope.selectedUser!=null && $scope.originalUser.id == $scope.selectedUser.id;
    };
    
    $scope.addNewUser = function() {
		var user = {};
		user.name = ' ';
		user.email = ' ';
		user.group = false;
        user.photoUrl = ' ';
                                    
		$scope.addUser(user);
	};
    
    $scope.revertUser = function() { 
        for (var i = 0; i < $scope.gridOptions.data.length; i++) { 
            if ($scope.gridOptions.data[i].id == $scope.originalUser.id) { 
                $scope.gridOptions.data[i] = $scope.originalUser; 
                $scope.selectUser( $scope.gridOptions.data[i] ); 
                $scope.originalUser = null;
                break;
            }
        }
	};
    
    $scope.filterUser = function( searchText ) { 
        if (searchText!=null && searchText.trim()!='') {
			var filtered = $scope.gridOptions.data.filter(function( user ){
                return !user.name.indexOf(searchText);
            });
            return filtered.map(function( user ){
                return user;
            });
		} else {
            $scope.listUsers();
        }
    };
    
    $scope.deleteUser = function() {
        
        $msgbox.showConfirmationMessage('Are you sure to delete user ' + $scope.selectedUser.name + '?').then(function (result) {
              if (result=='ok') { 
                $scope.removeUser( $scope.selectedUser );
              }
            }, 
            function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
	};
    
    $scope.uploadPhoto = function() {
        var modalInstance = $modal.open({
          templateUrl: 'userPhotoUpload.html',
          controller: 'UserPhotoUploadCtrl',
          size: 'lg',
          resolve: {
            userSelected: function () {
                return $scope.selectedUser;
            }
          }
        });

        modalInstance.result.then(function (message) {
              if (message=='ok') {
                
              }
            }, 
            function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
	};
    
    $scope.onUserSelect = function($item, $model, $label) { 
        $scope.findUser( $label );
    };
    
});

userModule.controller('UserPhotoUploadCtrl', function ($scope, $modalInstance, userSelected) {
    $scope.userSelected = userSelected;
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
});