'use strict';
/**
 * RoomAdminService
 */
angular.module('service.roomAdmin', [])

.constant('SERVICE_CONFIG', {
	URL : 'http://localhost:8080/conferenceroom-service'
})

.factory('RoomAdminService', function($http, SERVICE_CONFIG) {

	var service = {};
	
	/**
	 * API Methods
	 */
	service.getRoom = function(roomId) {
		var roomAdminServiceUrl = SERVICE_CONFIG.URL + "/service/room/" + roomId;
		var getConfig = {
		};
		return $http.get(roomAdminServiceUrl, getConfig).then(function(response) {
			return response.data;
		});
	}; 

	service.addRoom = function(room) {
		var roomAdminServiceUrl = SERVICE_CONFIG.URL + "/service/room/add";
		var postConfig = {};
		return $http.post(roomAdminServiceUrl, room, postConfig).then(function(response) {
			return response;
		});
	};

	service.updateRoom = function(room) {
		var roomAdminServiceUrl = SERVICE_CONFIG.URL + "/service/room/update";
		var postConfig = {};
		return $http.post(roomAdminServiceUrl, room, postConfig).then(function(response) {
			return response;
		});
	};

	service.deleteRoom = function(roomId) {
		var roomAdminServiceUrl = SERVICE_CONFIG.URL + "/service/room/delete/" + roomId;
		var deleteConfig = {
		};
		return $http.delete(roomAdminServiceUrl, deleteConfig).then(function(response) {
			return response.data;
		});
	}; 
	
	service.listRooms = function() {
		var roomAdminServiceUrl = SERVICE_CONFIG.URL + "/service/room/list";
		var getConfig = {
		};
		return $http.get(roomAdminServiceUrl, getConfig).then(function(response) {
			return response.data;
		});
	};

	return service;		
});