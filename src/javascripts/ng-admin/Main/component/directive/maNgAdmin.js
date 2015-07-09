function maNgAdminDirective(NgAdminConfiguration) {
    'use strict';

    return {
        scope: {
            'configuration': '&'
        },
        restrict: 'E',
        link: function(scope) {
            scope.configuration = NgAdminConfiguration;
        },
        template: `<div ui-view></div>`
    };
}

maNgAdminDirective.$inject = ['NgAdminConfiguration'];

export default maNgAdminDirective;
