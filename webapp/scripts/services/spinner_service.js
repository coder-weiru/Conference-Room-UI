/**
 * Generic Spinner
 */
angular.module('service.spinner', ['angularSpinner']).service('$spinner', ['usSpinnerService',
    
    function (usSpinnerService) {
        
        this.startSpin = function ( spinnerKey ) {
            usSpinnerService.spin(spinnerKey);
        };

        this.stopSpin = function ( spinnerKey ) {
            usSpinnerService.stop(spinnerKey);
        };

}]);
