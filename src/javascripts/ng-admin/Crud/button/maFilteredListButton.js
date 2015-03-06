/*global define*/

define(function () {
    'use strict';

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
    function maFilteredListButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                entityName: '@',
                filter: '&',
                text: '@',
                size: '@'
            },
            link: function (scope) {
                scope.buttonText = scope.text || ('See all related ' + scope.entityName);
                scope.gotoList = function () {
                    $state.go($state.get('list'), { 'entity': scope.entityName, 'search': scope.filter()});

                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoList()">' +
    '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;{{ buttonText }}' +
'</a>'
        };
    }

    maFilteredListButtonDirective.$inject = ['$state'];

    return maFilteredListButtonDirective;
});
