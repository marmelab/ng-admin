export default function maBatchDeleteButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            selection: '&',
            label: '@',
        },
        link: function ($scope) {
            $scope.label = $scope.label || 'DELETE';
            $scope.gotoBatchDelete = function () {
                var ids = $scope.selection().map(function(entry) {
                    return entry.identifierValue;
                });

                $state.go('batchDelete', angular.extend({
                    ids: ids,
                    entity: $scope.entity().name()
                }, $state.params));
            };
        },
        template:
`<span ng-click="gotoBatchDelete()">
<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>
</span>`
    };
}

maBatchDeleteButtonDirective.$inject = ['$state'];
