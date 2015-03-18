'use strict';
/**
 * ReservationController
 */
var reservationModule = angular.module('controller.reservation', [ 'service.reservation', 'service.messageBox', 'ui.calendar', 'ui.bootstrap' ]);

reservationModule.controller('CalendarCtrl', function($scope, $rootScope, $log, $timeout, $modal, $msgbox, ReservationService) {
    
    $scope.calendarOptions = {
        height: 400,
        editable: true,
        header:{
            left: 'month agendaWeek agendaDay',
            center: 'title',
            right: 'today prev,next'
        },
        defaultView: 'agendaWeek',
        dayClick: $scope.dayClick,
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
    
    $scope.dayClick = function(date){
    
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