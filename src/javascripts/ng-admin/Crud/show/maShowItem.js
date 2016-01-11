/**
 * A directive containing a label and a column
 *
 * To be used in the showView
 */
export default function maShowItem() {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&',
            datastore: '&'
        },
        link: {
            pre: function(scope) {
                scope.field = scope.field();
                scope.entry = scope.entry();
                scope.entity = scope.entity();
                scope.datastore = scope.datastore();
            }
        },
        template:
`<div class="col-lg-12 form-group">
    <label class="col-sm-2 control-label">{{ field.label() }}</label>
    <div class="show-value" ng-class="(field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7')">
        <div ng-class="::'ng-admin-field-' + field.name() + ' ' + 'ng-admin-type-' + field.type()">
            <ma-column field="::field" entity="::entity" datastore="::datastore"></ma-column>
        </div>
    </div>
</div>`
    };
}

maShowItem.$inject = [];
