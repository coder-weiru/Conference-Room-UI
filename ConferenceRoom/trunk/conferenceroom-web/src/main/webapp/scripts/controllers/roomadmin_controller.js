'use strict';
/**
 * RoomAdminController
 */
var roomModule = angular.module('controller.roomAdmin', [ 'service.roomAdmin', 'service.messageBox', 'ui.bootstrap']);

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
          console.log('current room:', currentRoom);
          $rootScope.$broadcast('slideChange', $scope.rooms.indexOf(currentRoom));
      }
    });
});

roomModule.controller('RoomCtrl', function($scope, $log, $modal, $msgbox, RoomAdminService) {
	
    var room = $scope.room = {};
    
	$scope.saveRoom = function () {
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
      
    $scope.addNewRoom = function() {
		var room = {};
		room.name = '';
		room.photoUrl = '';
		room.location = '';
        room.capacity = 0;
        room.projectorAvailable = false;
        room.tvAvailable = false;
        room.videoConferenceAvailable = false;
        room.audioConferenceAvailable = false;
        room.active = true;
		$scope.addRoom(room);
	};
    
    $scope.cancelAddRoom = function() {
        if ($scope.room && $scope.room.id==null) {
            var index = $scope.rooms.indexOf($scope.room); 
            $scope.rooms.splice(index,1);
        }
    }
    
    $scope.isNewRoom = function( room ) {
		return room!=null && room.id==null;
	};
    
	$scope.canSave = function() {
	    return $scope.roomForm.$valid && $scope.roomForm.$dirty;
	};
	
    $scope.canCancelSave = function() { 
	    return !$scope.room.id;
	};
    
	$scope.$on('slideChange', function(event, index) { 
        $scope.room = $scope.rooms[index];
    });
    
    $scope.$on('roomSaved', function(event, room) {  
        room.active = true;
        $scope.room = room;   
        $scope.roomForm.$setPristine();
    });
     
    $scope.$on('roomSaveErr', function(event, room) {  
        $scope.cancelAddRoom();
        $scope.roomForm.$setPristine();
    });
	
});