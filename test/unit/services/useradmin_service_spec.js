'use strict';

/* jasmine specs for UserAdminService */

describe('service.userAdmin', function() {

    beforeEach(module('service.userAdmin'));


    describe('UserAdminService', function() {
        var scope, httpBackend, userAdminService, result;

        beforeEach(inject(function(UserAdminService, SERVICE_CONFIG, $httpBackend) {
            httpBackend = $httpBackend;
            userAdminService = UserAdminService

            var url = SERVICE_CONFIG.URL;

            var mockedResponse = [{
                "id": "12312312",
                "title": "Transformers"
            }, {
                "id": "445433",
                "title": "Mackenna's Gold"
            }, {
                "id": "3335",
                "title": "Star Wars"
            }]

            //httpBackend.when("JSONP",url).respond(mockedResponse)
        }));

        it('should contain three items', function() {

            var wsRequest = userAdminService.listUsers();

            wsRequest.then(function(data) {
				debugger;				
                result = data.data.length;
				
            });
			
			console.log(result);
        });
    });

});