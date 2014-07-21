define([
    'text!../view/layout.html',
    'text!../view/dashboard.html'
], function (layoutTemplate, dashboardTemplate) {
    "use strict";

    function routing($stateProvider) {

        $stateProvider.state('main', {
            'abstract': true,
            'controller': 'AppController',
            'controllerAs': 'appController',
            'template': layoutTemplate
        });

        $stateProvider.state('dashboard', {
            parent: 'main',
            url: '/dashboard',
            controller: 'DashboardController',
            controllerAs: 'dashboardController',
            template: dashboardTemplate
        });

    }

    routing.$inject = ['$stateProvider'];

    return routing;
});
