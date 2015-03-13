'use strict';
/**
 * RoomAdminController
 */
var roomModule = angular.module('controller.roomAdmin', [ 'service.roomAdmin', 'ui.bootstrap']);

roomModule.controller('RoomCarouselCtrl', function($scope, $log, $timeout, $modal, RoomAdminService) {
    
    $scope.slideInterval = 5000;
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
    
    $scope.listRooms = function() { 
		RoomAdminService.listRooms().then(function(rooms) {
			$scope.clearSlides();
            for ( var i = 0; i < rooms.length; i++ ) {
                $scope.addSlide( rooms[i] );
            }
		});
	};
    
    $scope.listRooms();
});
