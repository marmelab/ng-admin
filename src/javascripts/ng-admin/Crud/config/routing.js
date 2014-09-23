define(function (require) {
    "use strict";

    var listTemplate = require('text!../view/list.html'),
        createTemplate = require('text!../view/create.html'),
        editTemplate = require('text!../view/edit.html'),
        deleteTemplate = require('text!../view/delete.html');

    var routing = function ($stateProvider) {

        $stateProvider
            .state('list', {
                parent: 'main',
                url: '/list/:entity?q&page&sortField&sortDir',
                params: {
                    entity: {},
                    q: null,
                    page: 1,
                    sortField: null,
                    sortDir: null
                },
                controller: 'ListController',
                controllerAs: 'listController',
                template: listTemplate,
                resolve: {
                    data: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
                        var page = $stateParams.page,
                            query = $stateParams.q,
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return CrudManager.getAll($stateParams.entity, page, null, true, query, sortField, sortDir);
                    }]
                }
            });

        $stateProvider
            .state('create', {
                parent: 'main',
                url: '/create/:entity',
                controller: 'FormController',
                controllerAs: 'formController',
                template: createTemplate,
                resolve: {
                    data: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
                        return CrudManager.getEditionFields($stateParams.entity, 'editable');
                    }],
                    referencedValues: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
                        return CrudManager.getReferencedValues($stateParams.entity);
                    }]
                }
            });

        $stateProvider
            .state('edit', {
                parent: 'main',
                url: '/edit/:entity/:id?sortField&sortDir',
                controller: 'FormController',
                controllerAs: 'formController',
                template: editTemplate,
                params: {
                    entity: {},
                    id: null,
                    sortField: null,
                    sortDir: null
                },
                resolve: {
                    data: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
                        return CrudManager.getOne($stateParams.entity, $stateParams.id);
                    }],
                    referencedValues: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
                        return CrudManager.getReferencedValues($stateParams.entity);
                    }],
                    referencedListValues: ['$stateParams', 'data', 'CrudManager', function($stateParams, data, CrudManager) {
                        var sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return CrudManager.getReferencedListValues($stateParams.entity, data, sortField, sortDir);
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
                    params: ['$stateParams', function($stateParams) {
                        return $stateParams;
                    }]
                }
            });

    };

    routing.$inject = ['$stateProvider'];

    return routing;
});
