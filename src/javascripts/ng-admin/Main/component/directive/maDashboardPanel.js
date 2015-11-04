export default function maDashboardPanel($state) {
    return {
        restrict: 'E',
        scope: {
            collection: '&',
            entries: '&',
            datastore: '&'
        },
        link: function(scope) {
            scope.gotoList = function () {
                $state.go($state.get('list'), { entity: scope.collection().entity.name() });
            };
        },
        template:
`<div class="panel-heading">
    <a ng-click="gotoList()">{{ collection().title() || collection().entity.label() }}</a>
</div>
<ma-datagrid name="{{ collection().name() }}"
    entries="entries()"
    fields="::collection().fields()"
    entity="::collection().entity"
    list-actions="::collection().listActions()"
    datastore="datastore()">
</ma-datagrid>`
    };
}

maDashboardPanel.$inject = ['$state'];
