/*global define*/

define(function (require) {
    'use strict';

    var viewActionsTemplate = require('text!./view-actions.html');

    function ViewActionsDirective($injector) {
        var $compile = $injector.get('$compile');

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                'override': '&',
                'entry': '=',
                'entity': '='
            },
            template: viewActionsTemplate,
            link: function($scope, element, attrs, controller, transcludeFn) {
                var override = $scope.override();
                if (!override) {
                    // use the default tag content
                    transcludeFn($scope, function(clone) {
                        element.append(clone);
                    });
                    return;
                }
                if (typeof override == 'string') {
                    // custom template, use it instead of default template
                    element.html(override);
                    $compile(element.contents())($scope);
                    return;
                }
                // list of buttons - default template
                $scope.buttons = override;
            }
        };
    }

    ViewActionsDirective.$inject = ['$injector'];

    return ViewActionsDirective;
});
