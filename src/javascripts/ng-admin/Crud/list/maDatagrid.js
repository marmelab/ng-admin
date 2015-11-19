import maDatagridController from './maDatagridController';

export default function maDatagrid() {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            entries: '=',
            selection: '=',
            fields: '&',
            listActions: '&',
            entity: '&',
            entryCssClasses: '=',
            datastore: '&',
            sortField: '@',
            sortDir: '@',
            sort: '&'
        },
        controllerAs: 'datagrid',
        controller: maDatagridController,
        template:
`<table class="grid table table-condensed table-hover table-striped">
    <thead>
        <tr>
            <th ng-if="selection">
                <ma-datagrid-multi-selector toggle-select-all="toggleSelectAll()" selection="selection" entries="entries"/>
            </th>
            <th ng-repeat="field in fields() track by $index" ng-class="field.getCssClasses()" class="ng-admin-column-{{ ::field.name() }} ng-admin-type-{{ ::field.type() }}">
                <a ng-click="datagrid.sortCallback(field)">
                    <span class="glyphicon {{ datagrid.sortDir === 'DESC' ? 'glyphicon-chevron-down': 'glyphicon-chevron-up' }}" ng-if="datagrid.isSorting(field)"></span>

                    {{ field.label() }}
                </a>
            </th>
            <th ng-if="datagrid.shouldDisplayActions" class="ng-admin-column-actions">
                Actions
            </th>
        </tr>
    </thead>

    <tbody>
        <tr ng-repeat="entry in entries track by entry.identifierValue" ng-class="getEntryCssClasses(entry)">
            <td ng-if="selection">
                <ma-datagrid-item-selector toggle-select="toggleSelect(entry)" selection="selection" entry="entry"/>
            </td>
            <td ng-repeat="field in fields() track by $index" ng-class="field.getCssClasses(entry)" class="ng-admin-column-{{ ::field.name() }} ng-admin-type-{{ ::field.type() }}">
                <ma-column field="::field" entry="::entry" entity="::entity" datastore="datagrid.datastore"></ma-column>
            </td>
            <td ng-if="datagrid.shouldDisplayActions" class="ng-admin-column-actions">
                <ma-list-actions entry="::entry" entity="::entity" buttons="listActions()"></ma-list-actions>
            </td>
        </tr>
    </tbody>
</table>`
    };
}

maDatagrid.$inject = [];
