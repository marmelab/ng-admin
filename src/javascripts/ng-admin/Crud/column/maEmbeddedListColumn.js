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
                let entries = Entry
                    .createArrayFromRest(scope.value() || [], targetFields, targetEntityName, targetEntity.identifier().name())
                    .sort((entry1, entry2) => {
                        // use < and > instead of substraction to sort strings properly
                        if (entry1.values[sortField] > entry2.values[sortField]) return sortDir;
                        if (entry1.values[sortField] < entry2.values[sortField]) return -1 * sortDir;
                        return 0;
                    })
                    .filter(filterFunc);
                if (!targetEntityName) {
                    let index = 0;
                    entries = entries.map(e => {
                        e._identifierValue = index++;
                        return e;
                    });
                };
                scope.field = field;
                scope.targetFields = targetFields;
                scope.entries = entries;
                scope.entity = targetEntityName ? NgAdminConfiguration().getEntity(targetEntityName) : targetEntity;
            }
        },
        template: `
<ma-datagrid ng-if="::entries.length > 0" name="{{ field.datagridName() }}"
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

