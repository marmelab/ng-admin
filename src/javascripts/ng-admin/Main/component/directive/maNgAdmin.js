function maNgAdminDirective(NgAdminConfiguration, $state) {
    'use strict';

    return {
        scope: {
            'configuration': '&'
        },
        restrict: 'E',
        link: function(scope) {
            if (!scope.configuration()) {
                scope.configuration = NgAdminConfiguration;
            }
            $state.go('initialize', { configuration: scope.configuration })
        },
        template: `<div ui-view></div>`
    };
}

maNgAdminDirective.$inject = ['NgAdminConfiguration', '$state'];

export default maNgAdminDirective;
