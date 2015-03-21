'use strict';
/**
 * ReservationService
 */
angular.module('service.reservation', [])

.constant('SERVICE_CONFIG', {
	URL : 'http://localhost:8080/conferenceroom-service'
})

.factory('ReservationService', function($http, SERVICE_CONFIG) {

	var service = {};
	
	service.makeReservation = function(roomId, reservation) {
		var reservationServiceUrl = SERVICE_CONFIG.URL + "/service/reservation/" + roomId + "/add";
		var postConfig = {};
		return $http.post(reservationServiceUrl, reservation, postConfig).then(function(response) {
			return response;
		});
	};

	service.updateReservation = function(roomId, reservation) {
		var reservationServiceUrl = SERVICE_CONFIG.URL + "/service/reservation/" + roomId + "/update";
		var postConfig = {};
		return $http.post(reservationServiceUrl, data, postConfig).then(function(response) {
			return response;
		});
	};

	service.cancelReservation = function(roomId, reservationId) {
		var reservationServiceUrl = SERVICE_CONFIG.URL + "/service/reservation/" + roomId + "/delete/" + reservationId;
		var deleteConfig = {
		};
		return $http.delete(reservationServiceUrl, deleteConfig).then(function(response) {
			return response.data;
		});
	}; 

	service.listReservationsByRoom = function(start, end, roomId) {
        var startParam = toISOString(start);
        var endParam = toISOString(end);
		var reservationServiceUrl = SERVICE_CONFIG.URL + "/service/reservation/" + roomId + "/list?start=" + startParam + "end=" + endParam;
		var getConfig = {};
		return $http.get(reservationServiceUrl, getConfig).then(function(response) {
			return response.data;
		});
	};
	
	service.listReservations = function(start, end) { 
        var startParam = toISOString(start);
        var endParam = toISOString(end);
		var reservationServiceUrl = SERVICE_CONFIG.URL + "/service/reservation/list?start=" + startParam + "&end=" + endParam;
		var getConfig = {};
		return $http.get(reservationServiceUrl, getConfig).then(function(response) {
			return response.data;
		});
	};

    function toISOString( date ) {
        if ( !Date.prototype.toISOString ) {
            ( function() {

                function pad(number) {
                  var r = String(number);
                  if ( r.length === 1 ) {
                    r = '0' + r;
                  }
                  return r;
                }

                Date.prototype.toISOString = function() {
                  return this.getUTCFullYear()
                    + '-' + pad( this.getUTCMonth() + 1 )
                    + '-' + pad( this.getUTCDate() )
                    + 'T' + pad( this.getUTCHours() )
                    + ':' + pad( this.getUTCMinutes() )
                    + ':' + pad( this.getUTCSeconds() )
                    + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                    + 'Z';
                };

          }() );
        }  else {
            return date.toISOString(); //"2011-12-19T15:28:46.493Z"
        }
    }
    
	return service;		
});