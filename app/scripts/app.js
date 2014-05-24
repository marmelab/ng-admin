'use strict';

angular
    .module('angularAdminApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'restangular',
        'ngGrid'
    ])
    .config(function ($routeProvider) {

        $routeProvider
            .when("/list/:entity", {
                templateUrl: "views/list.html",
                controller: 'ListCtrl',
                resolve: {
                    data: ['$route', 'listBuilder', function($route, listBuilder) {
                        return listBuilder.getListData($route.current.params.entity);
                    }]
                }
            })
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    panels: ['panelBuilder', function(panelBuilder) {
                        return panelBuilder.getPanelsData();
                    }]
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    });
