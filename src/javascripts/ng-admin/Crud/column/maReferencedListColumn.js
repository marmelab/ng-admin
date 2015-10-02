function maReferencedListColumn(NgAdminConfiguration) {
    return {
        scope: {
            'field': '&',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function(scope) {
                scope.field = scope.field();
                var targetEntity = scope.field.targetEntity();
                scope.entries = scope.datastore().getEntries(targetEntity.uniqueId + '_list');
                scope.entity = NgAdminConfiguration().getEntity(targetEntity.name());
            }
        },
        template: `
<ma-datagrid ng-if="::entries.length > 0" name="{{ field.datagridName() }}"
    entries="::entries"
    fields="::field.targetFields()"
    list-actions="::field.listActions()"
    entity="::entity"
    datastore="::datastore()">
</ma-datagrid>`
    };
}

maReferencedListColumn.$inject = ['NgAdminConfiguration'];

module.exports = maReferencedListColumn;

