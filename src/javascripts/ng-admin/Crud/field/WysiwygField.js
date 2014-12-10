/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a multiline HTML string - a rich text editor.
     *
     * @example <wysiwyg-field field="field" value="value"></wysiwyg-field>
     */
    function WysiwygField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var field = scope.field();
                scope.fieldClasses = field.getCssClasses();
                scope.name = field.name();
            },
            template: 
'<div text-angular ng-model="value" ' +
    'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }}"'+
    'ta-text-editor-class="border-around" ta-html-editor-class="border-around">' +
'</div>'
        };
    }

    WysiwygField.$inject = [];

    return WysiwygField;
});
