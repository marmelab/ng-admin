/**
 * Fixes an issue with Bootstrap Date Picker
 * @see https://github.com/angular-ui/bootstrap/issues/2659
 * @see https://github.com/angular-ui/bootstrap/pull/4062
 *
 * How does it work? AngularJS allows multiple directives with the same name,
 * and each is treated independently though they are instantiated based on the
 * same element/attribute/comment.
 *
 * So this directive goes along with ui.bootstrap's uib-datepicker-popup directive.
 * @see http://angular-ui.github.io/bootstrap/versioned-docs/0.12.0/#/datepicker
 */
export default function datepickerPopup() {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            // 'new Date' fallback
            scope.value = scope.value instanceof Date ? scope.value:new Date(scope.value);

            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    };
}

datepickerPopup.$inject = [];
