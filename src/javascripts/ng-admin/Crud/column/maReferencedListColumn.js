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
             'fields="field.getReferencedView().fields()"' +
             'entity="field.getReferencedView().entity"' +
             'listActions="[]">' +
'</ma-datagrid>'
        };
    }

    maReferencedListColumn.$inject = [];

    return maReferencedListColumn;
});
