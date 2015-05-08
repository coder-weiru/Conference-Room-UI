'use strict';

/* jasmine specs for UserAdminService */

describe('service.userAdmin', function() {

    beforeEach(module('service.userAdmin'));


    describe('UserAdminService', function() {
        var scope, httpBackend, userAdminService, result;
        // listUsers();
        var serviceUrl_listUsers;
        
        beforeEach(inject(function(UserAdminService, SERVICE_CONFIG, $httpBackend) {
            httpBackend = $httpBackend;
            userAdminService = UserAdminService
            serviceUrl_listUsers = SERVICE_CONFIG.URL + '/service/user/list';

            var mockUsers = [{
                "name": "John Doe",
                "email": "john.doe@coderconference2015.com",
                "group": false
            }, {
                "name": "Jane Doe",
                "email": "jane.doe@coderconference2015.com",
                "group": false
            }, {
                "name": "CyberCon",
                "email": "CyberCon@coderconference2015.com",
                "group": true
            }]

            httpBackend.when("GET", serviceUrl_listUsers).respond(mockUsers);
        }));

        it("should return mock users after invoking listUsers().", function() {
            userAdminService.listUsers().then(function(data) {
                result = data;
            });
            httpBackend.expect('GET', serviceUrl_listUsers);
            
            httpBackend.flush();
            
            expect(result.length).toEqual(3);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].email).toBe('john.doe@coderconference2015.com');
            expect(result[0].group).toBe(false);
            
        });

    });

});