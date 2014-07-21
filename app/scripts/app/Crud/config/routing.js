define([
    'text!../view/list.html',
    'text!../view/create.html',
    'text!../view/edit.html',
    'text!../view/delete.html'
], function (listTemplate, createTemplate, editTemplate, deleteTemplate) {
    "use strict";

    var routing = function ($stateProvider) {

        $stateProvider
            .state('list', {
              parent: 'main',
                url: '/list/:entity',
                controller: 'ListController',
                controllerAs: 'listController',
                template: listTemplate,

                resolve: {
                    CrudManager: "CrudManager",
                    data: function($stateParams, CrudManager) {
                        return CrudManager.getAll($stateParams.entity);
                    }
                }
            });

        $stateProvider
            .state('list-paginate', {
                parent: 'main',
                url: '/list/:entity/page/:page',
                controller: 'ListController',
                controllerAs: 'listController',
                template: listTemplate,
                resolve: {
                    data: ['$route', 'crudManager', function($route, CrudManager) {
                        return CrudManager.getAll($route.current.params.entity, $route.current.params.page);
                    }]
                }
            });

        $stateProvider
            .state('create', {
                parent: 'main',
                url: '/create/:entity',
                controller: 'CreateController',
                controllerAs: 'createController',
                template: createTemplate,
                resolve: {
                    data: ['$route', 'crudManager', function($route, CrudManager) {
                        return CrudManager.getEditionFields($route.current.params.entity, 'editable');
                    }]
                }
            });

        $stateProvider
            .state('edit', {
                parent: 'main',
                url: '/edit/:entity/:id',
                controller: 'EditController',
                controllerAs: 'editController',
                template: editTemplate,
                resolve: {
                    data: ['$route', 'crudManager', function($route, CrudManager) {
                        return CrudManager.getOne($route.current.params.entity, $route.current.params.id);
                    }]
                }
            });

        $stateProvider
            .state('delete', {
                parent: 'main',
                url: '/delete/:entity/:id',
                controller: 'DeleteController',
                controllerAs: 'deleteController',
                template: deleteTemplate,
                resolve: {
                    params: ['$route', function($route) {
                        return $route.current.params;
                    }]
                }
            });

    };

    routing.$inject = ['$stateProvider'];

    return routing;
});
