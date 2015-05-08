'use strict';

/* jasmine specs for UserAdminService */

describe('service.roomAdmin', function() {

    beforeEach(module('service.roomAdmin'));


    describe('RoomAdminService', function() {
        var scope, httpBackend, roomAdminService, result;
        // listRooms();
        var serviceUrl_listRooms;
        
        beforeEach(inject(function(RoomAdminService, SERVICE_CONFIG, $httpBackend) {
            httpBackend = $httpBackend;
            roomAdminService = RoomAdminService
            serviceUrl_listRooms = SERVICE_CONFIG.URL + '/service/room/list';
            
            var mockRooms = [{
                "name": "Channel Island",
                "location": "101 S Wacker, Chicago, IL 60606",
                "active": true
            }, {
                "name": "Lake Clark",
                "location": "101 S Wacker, Chicago, IL 60606",
                "active": false
            }, {
                "name": "Red Wood",
                "location": "101 S Wacker, Chicago, IL 60606",
                "active": true
            }]

            httpBackend.when("GET", serviceUrl_listRooms).respond(mockRooms);
        }));

        it("should return mock rooms after invoking listRooms().", function() {
            roomAdminService.listRooms().then(function(data) {
                result = data;
            });
            httpBackend.expect('GET', serviceUrl_listRooms);
            
            httpBackend.flush();
            
            expect(result.length).toEqual(3);
            expect(result[0].name).toBe('Channel Island');
            expect(result[0].location).toBe('101 S Wacker, Chicago, IL 60606');
            expect(result[0].active).toBe(true);
            
        });

    });

});