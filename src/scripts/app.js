require.config({
    waitSeconds: 30
});

require(['common', 'ng-admin'], function () {
    "use strict";

    require(['angular', 'MainModule', 'CrudModule'], function (angular) {
        angular.module('ng-admin', ['main', 'crud']);
    });
});
