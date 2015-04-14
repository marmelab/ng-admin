/*global define*/

define(function (require) {
    'use strict';

    var layoutTemplate = require('text!../view/layout.html'),
        dashboardTemplate = require('text!../view/dashboard.html'),
        errorTemplate = require('text!../view/404.html');

    function routing($stateProvider, $urlRouterProvider) {

        $stateProvider.state('main', {
            abstract: true,
            controller: 'AppController',
            controllerAs: 'appController',
            templateProvider: ['NgAdminConfiguration', function(Configuration) {
                return Configuration().layout() || layoutTemplate;
            }]
        });

        $stateProvider.state('dashboard', {
            parent: 'main',
            url: '/dashboard?sortField&sortDir',
            params: {
                sortField: null,
                sortDir: null
            },
            controller: 'DashboardController',
            controllerAs: 'dashboardController',
            template: dashboardTemplate
        });

        $stateProvider.state('ma-404', {
            parent: 'main',
            template: errorTemplate
        });

        $urlRouterProvider.when('', '/dashboard');

        $urlRouterProvider.otherwise(function($injector, $location) {
            var state = $injector.get('$state');
            state.go('ma-404');
            return $location.path();
        });
    }

    routing.$inject = ['$stateProvider', '$urlRouterProvider'];

    return routing;
});
