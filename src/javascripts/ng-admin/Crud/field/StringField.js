/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a one line string - a text input.
     *
     * @example <string-field field="field" value="value"></string-field>
     */
    function StringField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            template: '<input-field type="text" field="field()" value="value"></input-field>'
        };
    }

    StringField.$inject = [];

    return StringField;
});
