/**
 * Edition field for a multiline HTML string - a rich text editor.
 *
 * @example <ma-wysiwyg-field field="field" value="value"></ma-wysiwyg-field>
 */
export default function maWysiwygField() {
    return {
        scope: {
            'field': '&',
            'value': '='
        },
        restrict: 'E',
        link: function(scope, element) {
            var field = scope.field();
            scope.name = field.name();
        },
        template:
'<div text-angular ta-unsafe-sanitizer="{{ !field.sanitize() }}" ng-model="value" id="{{ name }}" name="{{ name }}" '+
    'ta-text-editor-class="border-around" ta-html-editor-class="border-around">' +
'</div>'
    };
}

maWysiwygField.$inject = [];
