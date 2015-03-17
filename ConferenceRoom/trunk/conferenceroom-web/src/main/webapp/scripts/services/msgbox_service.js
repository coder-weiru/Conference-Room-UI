/**
 * Generic Message Box
 */
angular.module('service.messageBox', ['ui.bootstrap']).service('$msgbox', ['$modal',
    
    function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            size: 'sm',
            templateUrl: 'views/msgbox.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close('ok');
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };
        
        this.showSuccessMessage = function( message ) {
           var modalOptions = {
                actionButtonText: '  OK  ',
                headerText: 'Success',
                bodyText: message,
                closeButtonDisabled: true
            };

            return this.showModal({}, modalOptions);
        };

        this.showErrorMessage = function( message ) {
           var modalOptions = {
                actionButtonText: '  Got it  ',
                headerText: 'Error',
                bodyText: message,
                closeButtonDisabled: true
            };

            return this.showModal({}, modalOptions);
        };
        
        this.showConfirmationMessage = function( message ) {
           var modalOptions = {
                actionButtonText: 'Yes, I\'m sure',
                closeButtonText: ' Cancel ',
                headerText: 'Confirmation',
                bodyText: message
            };

            return this.showModal({}, modalOptions);
        };

}]);
