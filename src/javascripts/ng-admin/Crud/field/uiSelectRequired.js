/**
 * Directive created to fix a bug with ui-select and multiple required values.
 * @see https://github.com/angular-ui/ui-select/issues/258
 */
export default function uiSelectRequired() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {
                var determineVal;
                if (angular.isArray(modelValue)) {
                    determineVal = modelValue;
                } else if (angular.isArray(viewValue)) {
                    determineVal = viewValue;
                } else {
                    return false;
                }

                return determineVal.length > 0;
            };
        }
    };
}

uiSelectRequired.$inject = [];
