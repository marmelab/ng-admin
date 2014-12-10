/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for an element in a list - a select.
     *
     * @example <choice-field field="field" value="value"></choice-field>
     */
    function ChoiceField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function($scope) {
                var field = $scope.field();
                $scope.fieldClasses = field.getCssClasses();
                $scope.name = field.name();
                $scope.choices = field.choices();
                $scope.v = field.validation();
            },
            template: 
'<select ng-model="value" ng-required="v.required" ' +
  'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control"> '+
  '<option ng-if="!v.required">-- select a value --</option>' +
  '<option ng-repeat="choice in choices" value="{{ choice.value }}" ng-selected="value == choice.value">' +
    '{{ choice.label }}' +
  '</option>' +
'</select>'
        };
    }

    ChoiceField.$inject = [];

    return ChoiceField;
});
