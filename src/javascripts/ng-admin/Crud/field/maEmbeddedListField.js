import Entry from 'admin-config/lib/Entry';

export default function maEmbeddedListField() {
    return {
        scope: {
            'field': '&',
            'value': '=',
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
                        return filterKeys.reduce((isFiltered, key) => isFiltered && entry.values[key] === filters[key], true);
                    };
                } else {
                    filterFunc = () => true;
                }
                scope.fields = targetFields;
                scope.formName = [];
                scope.targetEntity = targetEntity;
                scope.entries = Entry
                    .createArrayFromRest(scope.value || [], targetFields, targetEntityName, targetEntity.identifier().name())
                    .sort((entry1, entry2) => {
                        // use < and > instead of substraction to sort strings properly
                        if (entry1.values[sortField] > entry2.values[sortField]) {
                            return sortDir;
                        }
                        if (entry1.values[sortField] < entry2.values[sortField]) {
                            return -1 * sortDir;
                        }
                        return 0;
                    })
                    .filter(filterFunc);
                scope.addNew = () => scope.entries.push(Entry.createForFields(targetFields));
                scope.remove = entry => {
                    scope.entries = scope.entries.filter(e => e !== entry);
                };
                scope.init = ($index) => {
                    scope.formName[$index] = scope.$parent.form?scope.$parent.form['subform_' + $index] : "";
                }
                scope.$watch('entries', (newEntries, oldEntries) => {
                    if (newEntries === oldEntries) {
                        return;
                    }
                    scope.value = newEntries.map(e => e.transformToRest(targetFields));
                }, true);
            }
        },
        template: `
<div class="row"><div class="col-sm-12">
    <ng-form ng-repeat="entry in entries track by $index" class="subentry" name="subform_{{$index}}" >
        <div ng-init="init($index)">
            <div class="remove_button_container">
                <a class="btn btn-default btn-sm" ng-click="remove(entry)"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>&nbsp;<span translate="REMOVE"></span></a>
            </div>
            <div class="form-field form-group" ng-init="tmpFormName = formName[$parent.$index]" ng-repeat="field in ::fields track by $index">
                <ma-field field="::field" value="entry.values[field.name()]" entry="entry" entity="::targetEntity" form="::tmpFormName" datastore="::datastore()"></ma-field>
            </div>
            <hr/>
        </div>
    </ng-form>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <a class="btn btn-default btn-sm" ng-click="addNew()"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>&nbsp;<span translate="ADD_NEW" translate-values="{ name: field().name() }"></span></a>
        </div>
    </div>
</div>
</div>`
    };
}

maEmbeddedListField.$inject = [];
