'use strict';

/* jasmine specs for ReservationService */

describe('service.reservation', function() {

    beforeEach(module('service.reservation'));


    describe('ReservationService', function() {
        var scope, httpBackend, reservationService, result;
        
        // listReservations();
        var serviceUrl_listReservations;

        beforeEach(inject(function(ReservationService, SERVICE_CONFIG, $httpBackend) {
            httpBackend = $httpBackend;
            reservationService = ReservationService;
    
            var startTime = '2015-05-08T05:00:00.000Z';
            var endTime = '2015-05-09T04:59:59.999Z';
            serviceUrl_listReservations = SERVICE_CONFIG.URL + "/service/reservation/list?start=" + startTime + "&end=" + endTime;

            var mockEvents = [{
                "start": moment("2015-05-07 7:30", "YYYY-MM-DD HH:mm"),
                "end": moment("2015-05-07 9:00", "YYYY-MM-DD HH:mm"),
                "title": 'Event 1'
            }, {
                "start": moment("2015-05-07 9:00", "YYYY-MM-DD HH:mm"),
                "end": moment("2015-05-07 10:30", "YYYY-MM-DD HH:mm"),
                "title": 'Event 2'
            }, {
                "start": moment("2015-05-07 9:30", "YYYY-MM-DD HH:mm"),
                "end": moment("2015-05-07 10:30", "YYYY-MM-DD HH:mm"),
                "title": 'Event 3'
            }];

            httpBackend.when("GET", serviceUrl_listReservations).respond(mockEvents);

            
        }));

        it("Async listReservations()", function() {
               
            var start = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
            var end = moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999});
            
            reservationService.listReservations(start, end).then(function(data) {
                result = data;
            });
            
            httpBackend.expect('GET', serviceUrl_listReservations);
            
            httpBackend.flush();
            
            expect(result.length).toEqual(3);
            expect(result[0].title).toBe('Event 1');

        });

    });
});