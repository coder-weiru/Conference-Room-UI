'use strict';
/**
 * RoomAdminController
 */
var roomModule = angular.module('controller.roomAdmin', [ 'service.roomAdmin', 'ui.bootstrap']);

roomModule.controller('RoomCarouselCtrl', function($scope, $rootScope, $log, $timeout, $modal, RoomAdminService) {
    
    $scope.slideInterval = 5000;
    $scope.rooms = [];
    var slides = $scope.slides = [];
    
    $scope.clearSlides = function() {
        slides.splice(0, slides.length);
    };
    
    $scope.addSlide = function( room ) {
        var newWidth = 600 + slides.length + 1;
        slides.push({
          photoUrl: room.photoUrl,
          name: room.name,
          location: room.location,
          capacity: room.capacity 
        });
    };
    
    $scope.pauseSlide = function( ) {
        $scope.slideInterval = 0;
    };
    
    $scope.continueSlide = function( ) {
        $scope.slideInterval = 5000;
    };
    
    $scope.listRooms = function() { 
		RoomAdminService.listRooms().then(function(rooms) {
            $scope.rooms = rooms;
			$scope.clearSlides();
            for ( var i = 0; i < rooms.length; i++ ) {
                $scope.addSlide( rooms[i] );
            }
		});
	};
    
    $scope.listRooms();
    
    $scope.$watch(function () {
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].active) {
          return slides[i];
        }
      }
    }, function (currentSlide, previousSlide) {
      if (currentSlide !== previousSlide) {
          console.log('currentSlide:', currentSlide);
          $rootScope.$broadcast('slideChange', slides.indexOf(currentSlide));
      }
    });
});

roomModule.controller('RoomCtrl', function($scope, $log, RoomAdminService) {
	
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
			    $scope.errorMessage = 'Room information is saved successfully!';
                $scope.$broadcast('roomSaved', data);
		    } else {
		    	$scope.showMessage('Oops, we received your request, but there was an error processing it.');
                $scope.$broadcast('roomSaveErr', user);
		    }
		}, function(response) { 
            var data = response.data;                   
			if (data.httpStatus == 'BAD_REQUEST' || data.httpStatus == 'INTERNAL_SERVER_ERROR') {
			    $scope.showMessage(response.data.message);
		    } else {
		    	$scope.showMessage('There was a network error. Try again later.');
		    }
            $scope.$broadcast('roomSaveErr', user);
		});
	};
    
	$scope.revertRoom = function() {
		$scope.room = angular.copy($scope.originalUser(), $scope.room);
		$scope.roomForm.$setPristine();
	};
	
	$scope.canRevert = function() {
		return !angular.equals($scope.room, $scope.originalRoom());
	};
	
	$scope.canSave = function() {
	    return $scope.roomForm.$valid && !angular.equals($scope.room, $scope.originalRoom());
	};
	
	$scope.cancel = function() {
		if ($scope.isNewRoom($scope.room)) {
			$scope.deleteNewRoom();
		} else {
			$scope.revertRoom();
		}
		$scope.deSelectRoom();
	};
	
	$scope.originalRoom = function() {
		var origRoom = null;
		angular.forEach($scope.originalRoomList, function( room ) {
			var uid = $scope.selectedRoom.id;
			if (uid===room.id) {
		    	origRoom = room;
		    } 
		});
		return origRoom;
	};	
    
    $scope.$on('slideChange', function(event, index) { 
        $scope.room = $scope.rooms[index];
    });
	
});
