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
            link:  function (scope, element, attrs, ngModelCtrl) {
                var setExpression = attrs.ngModelSetter;

                function updateModelValue() {
                    scope.$value = ngModelCtrl.$viewValue;
                    scope.$eval(setExpression);
                    delete scope.$value;
                }

                scope.$watch(attrs.ngModel, updateModelValue);
            }
        };
    }

    ModelGetter.$inject = [];

    return ModelGetter;
});
