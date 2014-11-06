define(function (require) {
    "use strict";

    var layoutTemplate = require('text!../view/layout.html'),
        dashboardTemplate = require('text!../view/dashboard.html');

    function routing($stateProvider, $urlRouterProvider) {

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

        $urlRouterProvider.otherwise('/dashboard');
    }

    routing.$inject = ['$stateProvider', '$urlRouterProvider'];

    return routing;
});
