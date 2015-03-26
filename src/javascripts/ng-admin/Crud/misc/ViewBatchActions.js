/*global define*/

define(function (require) {
    'use strict';

    var viewActionsTemplate = require('text!./view-batch-actions.html');

    function ViewBatchActionsDirective($injector) {
        var $compile = $injector.get('$compile');

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                'entity': '=',
                'selection': '=',
                'buttons': '&'
            },
            template: viewActionsTemplate,
            link: function(scope) {
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
