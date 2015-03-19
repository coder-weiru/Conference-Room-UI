'use strict';
/**
 * ReservationController
 */
var reservationModule = angular.module('controller.reservation', [ 'service.reservation', 'service.roomAdmin', 'service.messageBox', 'ui.calendar', 'ui.bootstrap' ]);

reservationModule.controller('CalendarCtrl', function($scope, $rootScope, $log, $timeout, $modal, $msgbox, RoomAdminService, ReservationService) {
     
    $scope.events = [
      {title: 'All Day Event',start: new Date('Thu Oct 17 2013 09:00:00 GMT+0530 (IST)')},
      {title: 'Long Event',start: new Date('Thu Oct 17 2013 10:00:00 GMT+0530 (IST)'),end: new Date('Thu Oct 17 2013 17:00:00 GMT+0530 (IST)')},
      {id: 999,title: 'Repeating Event',start: new Date('Thu Oct 17 2013 09:00:00 GMT+0530 (IST)'),allDay: false}
    ];
     
    $scope.onDayClick = function( date, allDay, jsEvent, view ){ 
        $scope.$apply(function(){
          $log.info('Day Clicked ' + date);
        });
    };
     
     
    $scope.onEventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){ 
        $scope.$apply(function(){
          $log.info('Event Droped to make dayDelta ' + dayDelta);
        });
    };
     
     
    $scope.onEventResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){  
        $scope.$apply(function(){
          $log.info('Event Resized to make dayDelta ' + minuteDelta);
        });
    };
     
    $scope.onEventClick = function(event){           
        $scope.$apply(function(){
          $log.info(event.title + ' is clicked');
        });
    };
     
    $scope.onRenderView = function(view){    
        var date = new Date(view.calendar.getDate());
        $scope.currentDate = date.toDateString();
        $scope.$apply(function(){
          $log.info('Page render with date '+ $scope.currentDate);
        });
    };
     
    $scope.changeView = function(view,calendar) {
        currentView = view;
        calendar.fullCalendar('changeView',view);
        $scope.$apply(function(){
          $log.info('You are looking at '+ currentView);
        });
    };
    
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
        selectable: true,
        selectHelper: true,
        dayClick: $scope.onDayClick,
        eventDrop: $scope.onEventDrop,
        eventResize: $scope.onEventResize,
        eventClick: $scope.onEventClick,
        viewRender: $scope.onRenderView
    };
    
    $scope.eventSources = [$scope.events];
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