define([
    'angular',
    'app',
    'jquery',
    'bootstrap',
    'angular',
    'angular-resource',
    'angular-sanitize',
    'angular-route',
    'angular-ui-router',
    'restangular',
    '../scripts/controllers/create',
    '../scripts/controllers/delete',
    '../scripts/controllers/edit',
    '../scripts/controllers/home',
    '../scripts/controllers/list',
    '../scripts/controllers/main',
    '../scripts/controllers/sidebar',
    '../scripts/services/getConfig',
    '../scripts/services/crudManager'
], function(angular, app) {

    app.config(function ($routeProvider) {

        $routeProvider
            .when("/list/:entity", {
                templateUrl: "views/list.html",
                controller: 'ListCtrl',
                resolve: {
                    data: ['$route', 'crudManager', function($route, crudManager) {
                        return crudManager.getAll($route.current.params.entity);
                    }]
                }
            })
            .when("/list/:entity/page/:page", {
                templateUrl: "views/list.html",
                controller: 'ListCtrl',
                resolve: {
                    data: ['$route', 'crudManager', function($route, crudManager) {
                        return crudManager.getAll($route.current.params.entity, $route.current.params.page);
                    }]
                }
            })
            .when("/create/:entity", {
                templateUrl: "views/create.html",
                controller: 'CreateCtrl',
                resolve: {
                    data: ['$route', 'crudManager', function($route, crudManager) {
                        return crudManager.getEditionFields($route.current.params.entity, 'editable');
                    }]
                }
            })
            .when("/edit/:entity/:id", {
                templateUrl: "views/edit.html",
                controller: 'EditCtrl',
                resolve: {
                    data: ['$route', 'crudManager', function($route, crudManager) {
                        return crudManager.getOne($route.current.params.entity, $route.current.params.id);
                    }]
                }
            })
            .when("/delete/:entity/:id", {
                controller: 'DeleteCtrl',
                templateUrl: "views/delete.html",
                resolve: {
                    params: ['$route', function($route) {
                        return $route.current.params;
                    }]
                }
            })
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})
