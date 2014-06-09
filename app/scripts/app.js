'use strict';

define("app", [
    "angular",
    'famous-angular'
    ], function(angular) {


    var app =  angular.module('angularAdminApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'restangular',
        'ui.router',
       'famous.angular'
    ]);

    return app;
});
