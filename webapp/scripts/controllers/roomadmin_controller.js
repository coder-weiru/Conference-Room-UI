'use strict';
/**
 * RoomAdminController
 */
var roomModule = angular.module('controller.roomAdmin', [ 'service.roomAdmin', 'ui.bootstrap']);

roomModule.controller('RoomCarouselCtrl', function($scope, $log, $timeout, $modal, RoomAdminService) {
    
    $scope.slideInterval = 5000;
    var slides = $scope.slides = [];
    
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
          image: 'http://placekitten.com/' + newWidth + '/300',
          text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    
    for (var i=0; i<4; i++) {
        $scope.addSlide();
      }
	
});
