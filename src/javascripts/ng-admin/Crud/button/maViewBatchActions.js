export default function maViewBatchActionsDirective() {
    return {
        restrict: 'E',
        scope: {
            'entity': '=',
            'selection': '=',
            'buttons': '&',
            'label': '@',
        },
        link: function(scope) {
            scope.label = scope.label || 'N_SELECTED';
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
        },
        // the ng-class hidden is necessary to hide the inner blank space used for spacing buttons when the selection is not empty
        template:
`<span ng-if="selection" ng-class="{hidden:!selection || selection.length==0}"> <span class="btn-group" uib-dropdown is-open="isopen"><button type="button" ng-if="selection.length" class="btn btn-default dropdown-toggle" uib-dropdown-toggle >
            <span translate="{{ ::label }}" translate-values="{ length: selection.length }"></span>&nbsp;<span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li ng-repeat="button in buttons" ng-switch="button">
                <a ng-switch-when="delete">
                    <ma-batch-delete-button selection="selection" entity="entity"/>
                </a>
                <a ng-switch-default>
                    <span compile="button"></span>
                </a>
            </li>
        </ul>
    </span>
</span>`
    };
}

maViewBatchActionsDirective.$inject = [];
