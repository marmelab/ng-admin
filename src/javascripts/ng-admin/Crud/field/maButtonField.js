/*global define*/

define(function () {
    'use strict';

    /**
     * Toggle input
     *
     * @example <ma-button-field type="text" field="field" value="value"></ma-button-field>
     */
    function maButtonField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function (scope, element) {
                var field = scope.field();
                scope.name = field.name();
                scope.label = field.label();
                scope.value = !!scope.value;
                var a = element.children()[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    a[name] = attributes[name];
                }
                scope.toggle = function() {
                    this.value = !this.value;
                };
                scope.isActive = function() {
                    return !!this.value;
                };
            },
            template:
            '<a class="btn btn-default" ng-click="toggle()" id="{{ name }}" ng-class="{active: isActive()}" >{{ label }}</a>'
        };
    }

    maButtonField.$inject = [];

    return maButtonField;
});
