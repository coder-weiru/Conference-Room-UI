'use strict';
/**
 * RoomAdminController
 */
var roomModule = angular.module('controller.roomAdmin', [ 'service.roomAdmin', 'service.messageBox', 'angularSpinner', 'ui.bootstrap' ]);

roomModule.controller('RoomCarouselCtrl', function($scope, $rootScope, $log, $timeout, $modal, $msgbox, RoomAdminService) {
    
    $scope.slideInterval = 5000;
    
    $scope.pauseSlide = function( ) {
        $scope.slideInterval = 0;
    };
    
    $scope.continueSlide = function( ) {
        $scope.slideInterval = 5000;
    };
    
    var rooms = $scope.rooms = [];
    
    $scope.listRooms = function() { 
		RoomAdminService.listRooms().then(function(rooms) {
            $scope.rooms = rooms;
		});
	};
    
    $scope.addRoom = function( room ) { 
        $scope.pauseSlide();
        
        $scope.rooms.forEach(function (element) {
            element.active = false;
        });
        
        $scope.rooms.push( room );
        if ( $scope.rooms[rooms.length-1] ) {
			$scope.rooms[rooms.length-1].active=true;
		}
	};
    
    $scope.listRooms();
    
    $scope.$watch(function () { 
      for (var i = 0; i < $scope.rooms.length; i++) {
        if ($scope.rooms[i].active) {
          return $scope.rooms[i];
        }
      }
    }, function (currentRoom, previousRoom) {
      if (currentRoom !== previousRoom) {
          //console.log('current room:', currentRoom);
          $rootScope.$broadcast('slideChange', $scope.rooms.indexOf(currentRoom));
      }
    });
    
});

roomModule.controller('RoomCtrl', function($scope, $log, $modal, $msgbox, RoomAdminService, usSpinnerService) {
	
    var room = $scope.room = {};
    $scope.editMode = false;
    
	$scope.saveRoom = function () {
        
        $scope.startSpin();
        
		// If form is invalid, return and let AngularJS show validation errors.
		if ($scope.roomForm.$invalid) {
		    return;
		}
		var promise;
		if ($scope.isNewRoom($scope.room)) {
			promise = RoomAdminService.addRoom($scope.room);
		} else {
			promise = RoomAdminService.updateRoom($scope.room);
		}
        promise.then(function(response) { 
            
            $scope.stopSpin();
            
			var data = response.data;                   
			if (response.statusText == 'OK') {
			    $msgbox.showSuccessMessage('Conference room ' + $scope.room.name + ' has been saved successfully.');
                $scope.$broadcast('roomSaved', data);
		    } else {
		    	$msgbox.showErrorMessage('Oops, we received your request for saving ' + $scope.room.name + ' , but there was an error processing it.');
                $scope.$broadcast('roomSaveErr', data);
		    }
		}, function(response) { 
            var data = response.data;                   
			if (data.httpStatus == 'BAD_REQUEST' || data.httpStatus == 'INTERNAL_SERVER_ERROR') {
			    $msgbox.showErrorMessage(response.data.message);
		    } else {
		    	$msgbox.showErrorMessage('There was a network error while saving  ' + $scope.room.name + '. Try again later.');
		    }
            $scope.$broadcast('roomSaveErr', data);
		});
	};
    
    $scope.removeRoom = function( room ) {
        
        $scope.startSpin();
        
        if (room!=null && room.id!=null) {
			RoomAdminService.deleteRoom(room.id).then(function( data ) {
                
                $scope.stopSpin();
                
                $msgbox.showSuccessMessage('Conference room ' + $scope.room.name + ' has been removed.');
                $scope.$broadcast('roomDeleted', data); 
            });
		} 
    }; 
    
    $scope.toggleEditMode = function() {
		$scope.editMode = !$scope.editMode;
        if ($scope.editMode) {
            $scope.pauseSlide();
        } else {
            $scope.continueSlide();
        }
	};
    
    $scope.cancelEdit = function() {
		if ($scope.editMode) {
            if ($scope.room!=null && $scope.room.id==null) {
                $scope.purgeRoom(room);         
            }            
        }
        $scope.toggleEditMode();
	};
    
    $scope.addNewRoom = function() {
        
        $scope.toggleEditMode();
        
        var room = {};
		room.name = '';
		room.photoUrl = '';
		room.location = '';
        room.capacity = 10;
        room.projectorAvailable = false;
        room.tvAvailable = false;
        room.videoConferenceAvailable = false;
        room.audioConferenceAvailable = false;
        room.active = true;
		$scope.addRoom(room);
	};
    
    $scope.deleteRoom = function() {
        $msgbox.showConfirmationMessage('Are you sure to delete room ' + $scope.room.name + '?').then(function (result) {
              if (result=='ok') { 
                $scope.removeRoom( $scope.room );
              }
            }, 
            function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
	};
    
    $scope.purgeRoom = function( room ) {
        var index = -1;                                     
        for (var i = 0; i < $scope.rooms.length; i++) {
            if (room.id) {
                if ($scope.rooms[i].id==room.id) {
                   index = i;
                   break;
                }
            } else {
                index = $scope.rooms.indexOf(room);
                break;
            }
        }
        $scope.rooms.splice(index,1);
    }
    
    $scope.isNewRoom = function( room ) {
		return room!=null && room.id==null;
	};
    
    $scope.canSave = function() {
	    return $scope.editMode && $scope.roomForm.$valid && $scope.roomForm.$dirty;
	};
	
    $scope.canDelete = function() {
	    return $scope.editMode && $scope.room!=null && $scope.room.id!=null;
	};
    
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }
    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }
    
	$scope.$on('slideChange', function(event, index) { 
        $scope.room = $scope.rooms[index];
    });
    
    $scope.$on('roomSaved', function(event, room) {  
        room.active = true;
        $scope.room = room;   
        $scope.roomForm.$setPristine();
        $scope.toggleEditMode();
    });
     
    $scope.$on('roomSaveErr', function(event, room) {  
        $scope.cancelAddRoom();
        $scope.roomForm.$setPristine();
        $scope.toggleEditMode();
    });
	
    $scope.$on('roomDeleted', function(event, room) { 
        $scope.purgeRoom( room );
        $scope.toggleEditMode();
    });
    
});