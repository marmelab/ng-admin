/**
 * Link to filtered list
 *
 * Usage:
 *
 *     <!-- In a scope where the current entry is a post, link tio the related comments -->
 *     <ma-filtered-list-button
 *       entity-name="comments"
 *       filter="{ post_id: entry.values.id }"
 *       text="See related comments"
 *       size="xs">
 *     </ma-filtered-list-button>')
 *
 * Usage as a template field:
 *
 * nga.field('', 'template')
 *   .label('')
 *   .template('<ma-filtered-list-button entity-name="comments" filter="{ post_id: entry.values.id }"></ma-filtered-list-button>')
 */
export default function maFilteredListButtonDirective() {
    return {
        restrict: 'E',
        scope: {
            entityName: '@',
            filter: '&',
            label: '@',
            size: '@'
        },
        link: function (scope) {
            scope.label = scope.label || 'SEE_RELATED';
            scope.stateParams = { 'entity': scope.entityName, 'search': scope.filter() };
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="list(stateParams)">
    <span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}" translate-values="{ entityName: entityName }"></span>
</a>`
    };
}

maFilteredListButtonDirective.$inject = [];
