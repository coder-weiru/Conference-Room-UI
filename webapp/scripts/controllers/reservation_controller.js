'use strict';
/**
 * ReservationController
 */
var reservationModule = angular.module('controller.reservation', [ 'service.reservation', 'service.roomAdmin', 'service.userAdmin', 'service.messageBox', 'service.spinner', 'ui.calendar', 'ui.bootstrap', 'ui.bootstrap.datetimepicker' ]);

/* Generic Services */                                                                      
reservationModule.factory("helpers", function( $log ) {                                                                                                           
    var dateFromISO8601 = function(isostr) {   
            return moment(isostr);          
    };
    
    var overlapEvent = function( event, begin, stop ) {   
            //$log.debug('Event ' + event.title + ' start : ' + event.start.format() + ' end : ' + event.end.format() + ' selection begin : ' + begin.format() + ' selection stop : ' + stop.format());
                        
            var sameStart = begin.isSame(event.start, 'minute');
            var evtInBetween = begin.isBetween(event.start, event.end, 'minute');
            var selInBetween = event.start.isBetween(begin, stop, 'minute');
                
            if (sameStart) {
                $log.debug('Event ' + event.title + ' has same start as selected ');
            }
            if (evtInBetween) {
                $log.debug('Event ' + event.title + ' period overlaps the selected start time ');
            }
            if (selInBetween) {
                $log.debug('Event ' + event.title + ' has the start time in between the selected period ');
            }          
            return (sameStart||evtInBetween||selInBetween);
    };
    
    return {                                                                                                                                              dateFromISO8601: dateFromISO8601,
       reservationToEvent: function(reservation) { 
            return {
                title: reservation.title + ' (' + reservation.room.name + ') ',
                description: reservation.description,
                start: dateFromISO8601(reservation.startTime), 
                end: dateFromISO8601(reservation.endTime), 
                creator: reservation.creator,
                room: reservation.room,
                editable: false,
                eventStartEditable: false,
                durationEditable: false,
                overlap: true,
                //rendering: 'background',
                color: reservation.room.calendar.color,
                textColor: '#000'
            };
       },
       eventsInTime: function( events, evtStart, evtEnd ) { 
            var selected = [];
            for (var i = 0; i < events.length; i++) {
               if ( overlapEvent(events[i], evtStart, evtEnd) ) {
                    selected.push(events[i]);
                }
            }
            return selected;
       }
     };
});
     
reservationModule.controller('CalendarCtrl', function($scope, $rootScope, $log, $timeout, $modal, $msgbox, $spinner, ReservationService, helpers) {
     
    $scope.events = [];
    $scope.eventStart = moment();
    $scope.eventEnd = moment();
    $scope.calendar = null;
    
    $scope.removeEventSource = function( eventSource) { 
        if ($scope.calendar) {
            $scope.calendar.removeEventSource(eventSource);
        }
    }
    
    $scope.addEventSource = function( eventSource) { 
        if ($scope.calendar) {
            $scope.calendar.addEventSource(eventSource);
        }
    }     
    
    $scope.getEvents = function(start, end) { 
        $spinner.startSpin('spinner-2');
        ReservationService.listReservations(start, end).then(function(reservations) { 
            var events = [];
            reservations.forEach(function (element) { 
                  events.push(helpers.reservationToEvent(element));
            });
            $scope.removeEventSource($scope.events);
            $scope.events = events;
            $scope.addEventSource($scope.events);
            
            $spinner.stopSpin('spinner-2');
		});
    };
    
    $scope.onDayClick = function( date, allDay, jsEvent, view ) { 
        $scope.$apply(function(){
          $log.info('Day Clicked ' + date);
        });
    };
     
     
    $scope.onEventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
        $scope.$apply(function(){
          $log.info('Event Droped to make dayDelta ' + dayDelta);
        });
    };
     
     
    $scope.onEventResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {  
        $scope.$apply(function(){
          $log.info('Event Resized to make dayDelta ' + minuteDelta);
        });
    };
     
    $scope.onEventClick = function(event) {           
        $scope.$apply(function(){
          $log.info(event.title + ' is clicked');
        });
    };
     
    $scope.onRenderView = function(view){    
        $scope.calendar = view.calendar;
        $scope.currentDate = view.calendar.getDate()
        $scope.events.splice(0);
        $scope.$apply(function(){
            var date = new Date($scope.currentDate);
            $log.info('Page render with date '+ date.toDateString());
            var start = moment(date).set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
            var end = moment(date).set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999});
            $scope.getEvents(start, end);
        });
    };
     
    $scope.onSelect = function( start, end, jsEvent, view ) {
        $scope.eventStart = start;
        $scope.eventEnd = end;
        $scope.$apply(function(){
            $log.info('Time period selected from '+ $scope.eventStart.format() + ' to ' + $scope.eventEnd.format());
            var events = angular.copy($scope.events);
            var selectedEvents = helpers.eventsInTime(events, $scope.eventStart, $scope.eventEnd);
            $rootScope.$broadcast('eventSelectionChanged', selectedEvents);
        });
    };
    
    $scope.onUnSelect = function( view, jsEvent ) {
        $scope.$apply(function(){
            $rootScope.$broadcast('eventUnSelected', {});
        });
    };
    
    $scope.onEventAfterRender = function( event, element, view ) { 
        //element).css('width','50%');
    };
    
    $scope.changeView = function(view, calendar) {
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
        unselectAuto: false,
        timezone: 'local',
        dayClick: $scope.onDayClick,
        eventDrop: $scope.onEventDrop,
        eventResize: $scope.onEventResize,
        eventClick: $scope.onEventClick,
        viewRender: $scope.onRenderView,
        eventAfterRender: $scope.onEventAfterRender,
        select: $scope.onSelect,
        unselect: $scope.onUnSelect
    };
    
    $scope.$watch(function(scope) { 
            return scope.eventStart;
        },
        function(currStart, prevStart) {       
            $rootScope.$broadcast('eventStartChanged', currStart);
        }
    );
    
    $scope.$watch(function(scope) { 
            return scope.eventEnd;
        },
        function(currEnd, prevEnd) {        
            $rootScope.$broadcast('eventEndChanged', currEnd);
        }
    );
    
    $scope.$watch(function(scope) { 
            return scope.currentDate;
        },
        function(currentDate, prevCurrentDate) {        
            $rootScope.$broadcast('currentDateChanged', currentDate);
        }
    );
    
    $scope.$on('reservationSave', function(event, reservation) {  
        $scope.events.push(helpers.reservationToEvent(reservation));
        $scope.addEventSource($scope.events);
        $scope.calendar.unselect();
    });
    
    $scope.eventSources = [$scope.events];
});

reservationModule.controller('RoomListCtrl', function($scope, $rootScope, $log, $timeout, $modal, RoomAdminService) {
    
    var roomGrid = $scope.roomGrid = [];
    var rooms = $scope.rooms = [];
    $scope.eventStartDate = new Date();
    $scope.eventEndDate = new Date();
    
    $scope.disableAllRooms = function() {
        for (var i = 0; i < $scope.rooms.length; i++) {
            $scope.rooms[i].disabled = true;
        }              
    }
    
    $scope.listRooms = function() { 
		RoomAdminService.listRooms().then(function(rooms) { 
            $scope.rooms = rooms;
            $scope.disableAllRooms();
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
    
    $scope.addEvent = function( room ) { 
        var modalInstance = $modal.open({
          templateUrl: 'views/partials/new_event.html',
          controller: 'NewEventCtrl',
          //size: 'lg',
          resolve: {
            room: function () {
                return room;
            },
            currentDate: function () {
                return $scope.currentDate;
            },
            start: function () {
                return $scope.eventStartDate;
            },
            end: function () {
                return $scope.eventEndDate;
            }
          }
        });

        modalInstance.result.then(function (message) {
          if (message=='ok') {
                
              }
            }, 
            function () {
              $log.info('Modal dismissed at: ' + new Date());
          }
        );
    };
    
    $scope.listRooms();
    
    $scope.$on('eventStartChanged', function(event, eventStart) {  
        
        var localTime = moment(eventStart).subtract(moment().utcOffset(), 'm');
                                                                 
        $scope.eventStartDate = localTime.toDate();
            
    });
    
    $scope.$on('eventEndChanged', function(event, eventEnd) {   
           
        var localTime = moment(eventEnd).subtract(moment().utcOffset(), 'm');
                                                                 
        $scope.eventEndDate = localTime.toDate();
            
    });
    
    $scope.$on('currentDateChanged', function(event, currentDate) {   
           
        $scope.currentDate = currentDate;
            
    });
    
    $scope.$on('eventSelectionChanged', function(event, selectedEvents) {   
        for (var i = 0; i < $scope.rooms.length; i++) {
            var roomId = $scope.rooms[i].id;
            var selected = false;
            for (var j = 0; j < selectedEvents.length; j++) {
                if (roomId == selectedEvents[j].room.id) {
                    $scope.rooms[i].disabled = true;
                    selected = true;
                    break;
                }
            }
            if(!selected) {
                $scope.rooms[i].disabled = false;
            }
        }           
    });
    
    $scope.$on('eventUnSelected', function(event, selectedEvents) {   
          $scope.disableAllRooms();      
    });
});

reservationModule.controller('NewEventCtrl', function ($rootScope, $scope, $modalInstance, $timeout, $msgbox, $spinner, UserAdminService, ReservationService, helpers, room, currentDate, start, end) { 
    
    $scope.minDate = new Date();
    $scope.datetimePickerOptions = {
        dateOptions: {
            startingDay: 1,
            showWeeks: false
        },
        minuteStep: 15,
        showMeridian: true,
        dateFormat: "dd-MMM-yyyy",
        readonlyTime: false,
        minDate: $scope.minDate,
        dateDisabled: function(calendarDate, mode) {
            return ($scope.currentDate != null) && (mode === 'day') && ( $scope.currentDate.day() === 0 || $scope.currentDate.day() === 6 );
        }
    };
    
    $scope.room = room;
    $scope.currentDate = currentDate;
    $scope.editTime = false;
    $scope.editDetails = false;
    $scope.users = [];
    $scope.reservation = {};
    $scope.reservation.startTime = start;
    $scope.reservation.endTime = end;
    
    $scope.toggleEditDetails = function() { 
        $scope.editDetails = !$scope.editDetails;
    };
    
    $scope.toggleEditTime = function() { 
        $scope.editTime = !$scope.editTime;
    };
    
    $scope.listUsers = function() {
		UserAdminService.listUsers().then(function(users) {
			$scope.users = users;
		});
	};
	
    $scope.saveReservation = function () { 
        
        $spinner.startSpin('spinner-2');
        
		// If form is invalid, return and let AngularJS show validation errors.
		if ($scope.eventForm.$invalid) {
		    return;
		}
		var promise;
		if ($scope.isNewReservation($scope.reservation)) {
			promise = ReservationService.makeReservation($scope.room.id, $scope.reservation);
		} else {
			promise = ReservationService.updateReservation($scope.room.id, $scope.reservation);
		}
        promise.then(function(response) {  
            $spinner.stopSpin('spinner-2');
            
            var data = response.data;                   
			if (response.statusText == 'OK') {
                $rootScope.$broadcast('reservationSave', data);
            } else {
		    	$msgbox.showErrorMessage('Oops, we received your request for saving ' + $scope.reservation.title + ' , but there was an error processing it.');
                $rootScope.$broadcast('reservationSaveErr', data);
		    }                                           
		}, function(response) { 
            var data = response.data;                   
			if (data.httpStatus == 'BAD_REQUEST' || data.httpStatus == 'INTERNAL_SERVER_ERROR') {
			    $msgbox.showErrorMessage(response.data.message);
		    } else {
		    	$msgbox.showErrorMessage('There was a network error while saving  ' + $scope.reservation.title + '. Try again later.');
		    }
            $rootScope.$broadcast('reservationSaveErr', data);
            
            $spinner.stopSpin('spinner-2');
		});
	};
    
    $scope.filterUser = function( searchText ) { 
        if (searchText!=null && searchText.trim()!='') {
			var filtered = $scope.users.filter(function( user ){
                return !user.name.indexOf(searchText);
            });
            return filtered.map(function( user ){
                return user;
            });
		} else {
            $scope.listUsers();
        }
    };
    
    $scope.isNewReservation = function( reservation ) {
		return reservation!=null && reservation.id==null;
	};
    
    $scope.onUserSelect = function($item, $model, $label) { 
        $scope.asyncSelected = $label;
        $scope.reservation.creator = $item.id;
    };
    
    $scope.ok = function () {
        $modalInstance.close('ok');
        $scope.saveReservation( $scope.reservation );
    };                                                                                         
    
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };  
    
    $scope.listUsers();

});