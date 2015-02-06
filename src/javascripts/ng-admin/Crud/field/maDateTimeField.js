/*global define*/

define(function (require) {
    'use strict';

    var datetimepicker = require('bootstrap-datetimepicker');

    /**
     * Edition field for a date with time - a text input with a datepicker.
     *
     * @example <ma-date-time-field field="field" value="value"></ma-date-time-field>
     */
    function maDateField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var field = scope.field(),
                    $element = $(element),
                    input = element.find('input').eq(0),
                    attributes = field.attributes(),
                    picker = $(input);

                scope.value = scope.value ? new Date(scope.value) : null;
                scope.name = field.name();
                scope.format = field.format();
                scope.v = field.validation();

                for (var name in attributes) {
                    input.attr(name, attributes[name]);
                }

                picker.data('date-format', scope.format);

                $element
                    .datetimepicker({
                        defaultDate: scope.value
                    })
                    .on("change.dp", function(e) {
                        scope.value = new Date($element.data("DateTimePicker").getDate());
                        scope.$digest();
                    });
            },
            template:
'<div class="input-group date">' +
'   <input type="text" class="form-control" ng-required="v.required" />' +
'   <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>' +
'</div>'
        };
    }

    maDateField.$inject = [];

    return maDateField;
});
