export default function maFilterForm() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            datastore: '&',
            values: '=',
            removeFilter: '&'
        },
        link: function(scope) {
            scope.datastore = scope.datastore();
            scope.removeFilter = scope.removeFilter();
            scope.shouldFilter = () => Object.keys(scope.filters).length;
        },
        template:
`<div class="row">
    <form class="filters col-md-offset-6 col-md-6 form-horizontal" ng-if="shouldFilter()">
        <div class="filter {{ field.name() }} form-group input-{{ field.type() }}" ng-repeat="field in filters track by field.name()">
            <div class="col-sm-1 col-xs-1 remove_filter">
                <a ng-if="!field.pinned()" ng-click="removeFilter(field)"><span class="glyphicon glyphicon-remove"></span></a>
            </div>
            <label for="{{ field.name() }}" class="col-sm-4 col-xs-11 control-label">
                {{ field.label() }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;
            </label>
            <div class="col-sm-7" ng-switch="field.type()" ng-class="field.getCssClasses(entry)">
                <ma-filter field="::field" value="values[field.name()]" values="values" datastore="datastore"></ma-filter>
            </div>
        </div>
    </form>
</div>`
    };
}

maFilterForm.$inject = [];
