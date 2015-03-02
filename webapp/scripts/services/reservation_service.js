/**
 * ReservationService
 */
angular.module('service.reservation', [])

.constant('SERVICE_CONFIG', {
	URL : 'http://localhost:8080/conferenceroom-service'
})

.factory('reservationService', function($http, SERVICE_CONFIG) {

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

	service.listReservationsByRoom = function(roomId) {
		var reservationServiceUrl = SERVICE_CONFIG.URL + "/service/reservation/" + roomId + "/list";
		var getConfig = {};
		return $http.get(reservationServiceUrl, getConfig).then(function(response) {
			return response.data;
		});
	};
	
	service.listReservations = function() {
		var reservationServiceUrl = SERVICE_CONFIG.URL + "/service/reservation/list";
		var getConfig = {};
		return $http.get(reservationServiceUrl, getConfig).then(function(response) {
			return response.data;
		});
	};

	return service;		
});