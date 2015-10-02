import Entry from 'admin-config/lib/Entry';

function maEmbeddedListColumn(NgAdminConfiguration) {
    return {
        scope: {
            'field': '&',
            'value': '&',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function(scope) {
                const field = scope.field();
                const targetEntity = field.targetEntity();
                const targetEntityName = targetEntity.name();
                const targetFields = field.targetFields();
                const sortField = field.sortField();
                const sortDir = field.sortDir() === 'DESC' ? -1 : 1;
                var filterFunc;
                if (field.permanentFilters()) {
                    const filters = field.permanentFilters();
                    const filterKeys = Object.keys(filters);
                    filterFunc = (entry) => {
                        return filterKeys.reduce((isFiltered, key) => isFiltered && entry.values[key] == filters[key], true)
                    }
                } else {
                    filterFunc = () => true;
                }
                const entries = Entry
                    .createArrayFromRest(scope.value(), targetFields, targetEntityName, targetEntity.identifier().name())
                    .sort((entry1, entry2) => sortDir * (entry1.values[sortField] - entry2.values[sortField]))
                    .filter(filterFunc);
                scope.field = field;
                scope.targetFields = targetFields;
                scope.entries = entries;
                scope.entity = targetEntityName ? NgAdminConfiguration().getEntity(targetEntityName) : targetEntity;
            }
        },
        template: `
<ma-datagrid name="{{ field.datagridName() }}"
    entries="::entries"
    fields="::targetFields"
    list-actions="::field.listActions()"
    entity="::entity"
    datastore="::datastore()">
</ma-datagrid>`
    };
}

maEmbeddedListColumn.$inject = ['NgAdminConfiguration'];

module.exports = maEmbeddedListColumn;

