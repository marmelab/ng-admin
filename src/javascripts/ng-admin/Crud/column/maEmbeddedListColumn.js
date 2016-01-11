import Entry from 'admin-config/lib/Entry';

function sorter(sortField, sortDir) {
    return (entry1, entry2) => {
        // use < and > instead of substraction to sort strings properly
        const sortFactor = sortDir === 'DESC' ? -1 : 1;
        if (entry1.values[sortField] > entry2.values[sortField]) {
            return sortFactor;
        }
        if (entry1.values[sortField] < entry2.values[sortField]) {
            return -1 * sortFactor;
        }
        return 0;
    };
}

export default function maEmbeddedListColumn(NgAdminConfiguration) {
    const application = NgAdminConfiguration(); // jshint ignore:line
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
                const sortDir = field.sortDir();
                var filterFunc;
                if (field.permanentFilters()) {
                    const filters = field.permanentFilters();
                    const filterKeys = Object.keys(filters);
                    filterFunc = (entry) => filterKeys.reduce((isFiltered, key) => isFiltered && entry.values[key] === filters[key], true);
                } else {
                    filterFunc = () => true;
                }
                let entries = Entry
                    .createArrayFromRest(scope.value() || [], targetFields, targetEntityName, targetEntity.identifier().name())
                    .sort(sorter(sortField, sortDir))
                    .filter(filterFunc);
                if (!targetEntityName) {
                    let index = 0;
                    entries = entries.map(e => {
                        e._identifierValue = index++;
                        return e;
                    });
                }
                scope.field = field;
                scope.targetFields = targetFields;
                scope.entries = entries;
                scope.entity = targetEntityName ? application.getEntity(targetEntityName) : targetEntity;
                scope.sortField = sortField;
                scope.sortDir = sortDir;
                scope.sort = field => {
                    let sortDir = 'ASC';
                    const sortField = field.name();
                    if (scope.sortField === sortField) {
                        // inverse sort dir
                        sortDir = scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
                    }
                    scope.entries = scope.entries.sort(sorter(sortField, sortDir));
                    scope.sortField = sortField;
                    scope.sortDir = sortDir;
                };
            }
        },
        template: `
<ma-datagrid ng-if="::entries.length > 0"
    entries="entries"
    fields="::targetFields"
    list-actions="::field.listActions()"
    entity="::entity"
    datastore="::datastore()"
    sort-field="{{ sortField }}"
    sort-dir="{{ sortDir }}"
    sort="::sort">
</ma-datagrid>`
    };
}

maEmbeddedListColumn.$inject = ['NgAdminConfiguration'];
