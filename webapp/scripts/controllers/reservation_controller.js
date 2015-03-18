'use strict';
/**
 * ReservationController
 */
var reservationModule = angular.module('controller.reservation', [ 'service.reservation', 'service.roomAdmin', 'service.messageBox', 'ui.calendar', 'ui.bootstrap' ]);

reservationModule.controller('CalendarCtrl', function($scope, $rootScope, $log, $timeout, $modal, $msgbox, RoomAdminService, ReservationService) {
    
    $scope.calendarOptions = {
        height: 500,
        editable: true,
        weekends: false,
        businessHours: {
            start: '8:00', 
            end: '18:00',
            dow: [ 1, 2, 3, 4, 5]
        },
        header:{
            left: 'month agendaWeek agendaDay',
            center: 'title',
            right: 'today prev,next'
        },
        defaultView: 'agendaDay',
        dayClick: $scope.onDayClick,
        selectable: true,
        selectHelper: true,
        select: $scope.onSelect,
        eventDrop: $scope.$apply,
        eventResize: $scope.$apply
    };
    
    $scope.events = [
        {   title: 'All Day Event',
            start: moment().add(3, 'days').format('L') },
        {   title: 'Fun with AngularJS',
            start: moment().startOf('hour').format(),
            end: moment().endOf('hour').add(1, 'hour').format(),
            allDay: false 
        }
        ];

    $scope.eventSources = [$scope.events];
    
    $scope.onDayClick = function(date){
    
        $scope.$apply(function() {
            $scope.events.push(
                { title: "new event",
                  start: date,
                  end: moment(date).add('hours', 1).format(),
                  allDay: false });
                });
    };

    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };

    
});

reservationModule.controller('RoomListCtrl', function($scope, $rootScope, $log, $timeout, $modal, $msgbox, RoomAdminService) {
    
    var roomGrid = $scope.roomGrid = [];
    var rooms = $scope.rooms = [];
    
    $scope.listRooms = function() { 
		RoomAdminService.listRooms().then(function(rooms) { 
            $scope.rooms = rooms;
            $scope.buildGrid( rooms );
		});
	};
    
    $scope.buildGrid = function( rooms ) {
        var row = 0;
        var col = 0;
        var roomRow;
        var remainder = rooms.length % 4;
        for (var i = 0; i < remainder; i++) {
            rooms.push({});
        }        
        for (var i = 0; i < rooms.length; i++) {
            row = Math.floor(i/4);
            col = i % 4;
            if (col==0) {
                roomRow = [];
                roomGrid.push(roomRow);                
            }
            roomRow.push(rooms[i]);
        }            
    };
    
    $scope.listRooms();
    
});