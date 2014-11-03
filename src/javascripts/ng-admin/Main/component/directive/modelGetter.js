/*global define*/

// Angular ngModelOptions.getterSetter does not keep the scope of the function when calling it
// @see http://jsfiddle.net/BDyAs/15/

define(function () {
    'use strict';

    function ModelGetter() {
        return {
            require: "ngModel",
            controller: function ($scope) {
                $scope.getValue = function () {
                    return $scope.myValue;
                };
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var getExpression = attrs.ngModelGetter;

                function updateViewValue(newValue) {
                    if (newValue !== ngModelCtrl.$viewValue) {
                        ngModelCtrl.$setViewValue(newValue);
                        ngModelCtrl.$render();
                    }

                    var updateExpression = attrs.ngModel + "=" + getExpression;
                    scope.$eval(updateExpression);
                }

                updateViewValue();

                scope.$watch(getExpression, updateViewValue);
            }
        };
    }

    ModelGetter.$inject = [];

    return ModelGetter;
});
