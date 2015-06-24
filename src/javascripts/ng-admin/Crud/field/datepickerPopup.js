/* Fixes an issue with Bootstrap Date Picker
   @see https://github.com/angular-ui/bootstrap/issues/2659 */
var datepickerPopup = function () {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    }
};

datepickerPopup.$inject = [];

export default datepickerPopup;
