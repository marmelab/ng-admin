/*global define*/

define(function (require) {
    'use strict';

    function maReferencedListColumn() {
        return {
            restrict: 'E',
            scope: {
                field: '&'
            },
            link: function(scope) {
                scope.field = scope.field();
            },
            template:
'<ma-datagrid name="{{ field.getReferencedView().name() }}"' +
             'entries="field.entries"' +
             'fields="field.getReferencedView().displayedFields"' +
             'entity="field.getReferencedView().entity"' +
             'per-page="field.getReferencedView().perPage()"' +
             'listActions="[]" infinite-pagination="false" with-pagination="false">' +
'</ma-datagrid>'
        };
    }

    maReferencedListColumn.$inject = [];

    return maReferencedListColumn;
});
