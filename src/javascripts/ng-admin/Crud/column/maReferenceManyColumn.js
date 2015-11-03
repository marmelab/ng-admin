export default function maReferenceManyColumn() {
    return {
        restrict: 'E',
        scope: {
            values: '&'
        },
        template:
`<span ng-repeat="ref in values() track by $index">
    <span class="label label-default">{{ ref }}</span>
</span>`
    };
}

maReferenceManyColumn.$inject = [];
