var layoutTemplate = require('../view/layout.html'),
    dashboardTemplate = require('../view/dashboard.html'),
    errorTemplate = require('../view/404.html');

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
        templateProvider: ['NgAdminConfiguration', function(Configuration) {
            return Configuration().dashboard().template() || dashboardTemplate;
        }]
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

module.exports = routing;
