'use strict';

/* jasmine specs for ReservationService */

describe('service.reservation', function() {

    beforeEach(module('service.reservation'));


    describe('ReservationService', function() {
        var scope, httpBackend, reservationService, result;

        beforeEach(inject(function(ReservationService, SERVICE_CONFIG, $httpBackend) {
            httpBackend = $httpBackend;
            reservationService = ReservationService

            var url = SERVICE_CONFIG.URL;

            
        }));

        it("Async listUsers()", function() {
            setTimeout(function() {
                var wsRequest = reservationService.listReservations();

                wsRequest.then(function(data) {
                    debugger;				
                    result = data.data.length;
                    console.log(result);
                });
                }, 9000);
        }, 10000);

    });

});