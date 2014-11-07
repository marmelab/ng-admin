/*global define*/

define(function (require) {
    'use strict';

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
                    data: ['$stateParams', 'ListViewRepository', 'NgAdminConfiguration', function ($stateParams, ListViewRepository, Configuration) {
                        var config = Configuration(),
                            listView = config.getViewByEntityAndType($stateParams.entity, 'ListView'),
                            page = $stateParams.page,
                            query = $stateParams.q,
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir,
                            quickFilter = $stateParams.quickFilter,
                            filters = null;

                        if (quickFilter) {
                            filters = listView.getQuickFilterParams(quickFilter);
                        }

                        return ListViewRepository.getAll(listView, page, true, query, sortField, sortDir, filters);
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
                    view: ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
                        var config = Configuration();

                        return config.getViewByEntityAndType($stateParams.entity, 'CreateView');
                    }],
                    entry: ['view', function (view) {
                        return view
                            .mapEntry({})
                            .clear()
                            .processFieldsDefaultValue();
                    }],
                    referencedValues: ['ListViewRepository', 'view', function (ListViewRepository, view) {
                        return ListViewRepository.getReferencedValues(view);
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
                    view: ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
                        var config = Configuration();

                        return config.getViewByEntityAndType($stateParams.entity, 'EditView');
                    }],
                    entry: ['$stateParams', 'FormViewRepository', 'view', function ($stateParams, FormViewRepository, view) {
                        return FormViewRepository.getOne(view, $stateParams.id);
                    }],
                    referencedValues: ['ListViewRepository', 'view', function (ListViewRepository, view) {
                        return ListViewRepository.getReferencedValues(view);
                    }],
                    referencedListValues: ['$stateParams', 'ListViewRepository', 'view', 'entry', function ($stateParams, ListViewRepository, view, entry) {
                        var sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return ListViewRepository.getReferencedListValues(view, sortField, sortDir, entry.identifierValue);
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
                    params: ['$stateParams', function ($stateParams) {
                        return $stateParams;
                    }]
                }
            });

    };

    routing.$inject = ['$stateProvider'];

    return routing;
});
