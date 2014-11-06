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
                url: '/list/:entity?q&page&sortField&sortDir&quickFilter',
                params: {
                    entity: {},
                    q: null,
                    page: 1,
                    quickFilter: null,
                    sortField: null,
                    sortDir: null
                },
                controller: 'ListController',
                controllerAs: 'listController',
                template: listTemplate,
                resolve: {
                    data: ['$stateParams', 'CrudManager', 'NgAdminConfiguration', function($stateParams, CrudManager, Configuration) {
                        var config = Configuration(),
                            entity = $stateParams.entity,
                            entityConfig = config.getEntity(entity),
                            page = $stateParams.page,
                            query = $stateParams.q,
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir,
                            quickFilter = $stateParams.quickFilter,
                            filters = null;

                        if (quickFilter) {
                            filters = entityConfig.getQuickFilterParams(quickFilter);
                        }

                        return CrudManager.getAll(entity, page, null, true, query, sortField, sortDir, filters);
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
                    entity: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
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
                    entity: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
                        return CrudManager.getOne($stateParams.entity, $stateParams.id);
                    }],
                    referencedValues: ['$stateParams', 'CrudManager', function($stateParams, CrudManager) {
                        return CrudManager.getReferencedValues($stateParams.entity);
                    }],
                    referencedListValues: ['$stateParams', 'entity', 'CrudManager', function($stateParams, entity, CrudManager) {
                        var sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return CrudManager.getReferencedListValues($stateParams.entity, entity, sortField, sortDir);
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
