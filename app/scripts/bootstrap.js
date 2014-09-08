require(['angular'], function (angular) {
    "use strict";

    require(['domReady!'], function (document) {
        // we add the ng-app attribute for pure debugging purposes
        // historically, it was needed in case angular scenario was used for e2e tests
        document.body.setAttribute('ng-app', 'ng-admin');

        // async resource download implies async angular app bootstrap
        angular.bootstrap(document.body, ['ng-admin']);
    });
});
