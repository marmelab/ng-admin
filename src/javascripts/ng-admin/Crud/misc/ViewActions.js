export default function ViewActions($injector) {
    var $compile = $injector.get('$compile');

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            override: '&',
            entry: '=',
            entity: '=',
            selection: '=',
            batchButtons: '&',
            datastore: '=',
            search: '=',
            filters: '&',
            enabledFilters: '=',
            enableFilter: '&'
        },
        link: function($scope, element, attrs, controller, transcludeFn) {
            var override = $scope.override();
            if (!override) {
                // use the default tag content
                transcludeFn($scope, function(clone) {
                    element.append(clone);
                });
                return;
            }
            if (typeof override === 'string') {
                // custom template, use it instead of default template
                element.html(override);
                $compile(element.contents())($scope);
                return;
            }
            // list of buttons - default template
            $scope.buttons = override;
        },
        template:
`<span ng-repeat="button in buttons" ng-switch="button" class="view_actions">
    <ma-filter-button ng-switch-when="filter" filters="filters()" enabled-filters="enabledFilters" enable-filter="enableFilter()"></ma-filter-button>
    <ma-view-batch-actions ng-switch-when="batch" buttons="batchButtons()" selection="selection" entity="entity"></ma-view-batch-actions>
    <ma-back-button ng-switch-when="back"></ma-back-button>
    <ma-list-button ng-switch-when="list" entity="entity"></ma-list-button>
    <ma-create-button ng-switch-when="create" entity="entity"></ma-create-button>
    <ma-show-button ng-switch-when="show" entry="entry" entity="entity"></ma-show-button>
    <ma-edit-button ng-switch-when="edit" entry="entry" entity="entity"></ma-edit-button>
    <ma-delete-button ng-switch-when="delete" entry="entry" entity="entity"></ma-delete-button>
    <ma-export-to-csv-button ng-switch-when="export" datastore="datastore" entity="entity" search="search"></ma-export-to-csv-button>
    <span ng-switch-default><span compile="button"></span></span>
</span>`
    };
}

ViewActions.$inject = ['$injector'];
