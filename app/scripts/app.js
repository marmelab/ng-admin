require.config({
    waitSeconds: 30
});

require(['common', 'common-famous', 'ng-admin'], function () {
    "use strict";

    require(['angular', 'MainModule', 'CrudModule'], function (angular) {

        angular.module('ng-admin', ['main', 'crud']);
    });
});
