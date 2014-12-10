/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a secret string - a password input.
     *
     * @example <password-field field="field" value="value"></password-field>
     */
    function PasswordField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            template: '<input-field type="password" field="field()" value="value"></input-field>'
        };
    }

    PasswordField.$inject = [];

    return PasswordField;
});
