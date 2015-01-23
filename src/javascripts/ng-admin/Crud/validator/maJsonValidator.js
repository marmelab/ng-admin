/*global define*/

define(function (require) {
    'use strict';

    function maJsonValidator() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attr, ctrl) {
                ctrl.$validators.json = function(value) {
                    if (ctrl.$isEmpty(value)) {
                        return true;
                    }

                    try {
                        angular.fromJson(value);

                        return true;
                    } catch (e) {
                        return false;
                    }
                };
            }
        };
    }

    maJsonValidator.$inject = [];

    return maJsonValidator;
});
