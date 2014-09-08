require.config({
    waitSeconds: 30
});

require(['common', 'common-famous', 'ng-admin'], function () {
    "use strict";

    require(['angular', 'MainModule', 'CrudModule'], function (angular) {

        angular.module('ng-admin', ['main', 'crud']);

        require(['domReady!'], function (document) {
            // we add the ng-app attribute for pure debugging purposes
            // historically, it was needed in case angular scenario was used for e2e tests
            document.body.setAttribute('ng-app', 'ng-admin');

            // async resource download implies async angular app bootstrap
            angular.bootstrap(document.body, ['ng-admin']);
        });
    });
});
