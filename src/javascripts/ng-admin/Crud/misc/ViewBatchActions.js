/*global define*/

define(function (require) {
    'use strict';

    var viewActionsTemplate = require('./view-batch-actions.html');

    function ViewBatchActionsDirective($injector) {
        var $compile = $injector.get('$compile');

        return {
            restrict: 'E',
            scope: {
                'entity': '=',
                'selection': '=',
                'buttons': '&'
            },
            template: viewActionsTemplate,
            link: function(scope) {
                scope.isopen = false;

                scope.toggleDropdown = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.isopen = !scope.isopen;
                };

                scope.buttons = scope.buttons();
                if (typeof scope.buttons === 'string') {
                    scope.customTemplate = scope.buttons;
                    scope.buttons = null;
                }

            }
        };
    }

    ViewBatchActionsDirective.$inject = ['$injector'];

    return ViewBatchActionsDirective;
});
