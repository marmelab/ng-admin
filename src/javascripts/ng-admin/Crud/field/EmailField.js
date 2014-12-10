/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for an email string - an email input.
     *
     * @example <email-field field="field" value="value"></email-field>
     */
    function EmailField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            template: '<input-field type="email" field="field()" value="value"></input-field>'
        };
    }

    EmailField.$inject = [];

    return EmailField;
});
