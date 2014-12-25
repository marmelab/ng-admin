/*global define*/

define(function (require) {
    'use strict';

    var listTemplate = require('text!./list/list.html'),
        showTemplate = require('text!./show/show.html'),
        createTemplate = require('text!./form/create.html'),
        editTemplate = require('text!./form/edit.html'),
        deleteTemplate = require('text!./delete/delete.html');

    function templateProvider(viewName, defaultView) {
        return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
            var view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
            var customTemplate = view.template();
            return customTemplate ? customTemplate : defaultView;
        }];
    }

    function viewProvider(viewName) {
        return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
            var view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
            if (!view.isEnabled()) {
                throw new Error('The ' + viewName + ' is disabled for this entity');
            }
            return view;
        }];
    }

    function routing($stateProvider) {

        $stateProvider
            .state('list', {
                parent: 'main',
                url: '/list/:entity?{search:json}&page&sortField&sortDir&quickFilter',
                params: {
                    entity: null,
                    page: null,
                    search: null,
                    quickFilter: null,
                    sortField: null,
                    sortDir: null
                },
                controller: 'ListController',
                controllerAs: 'listController',
                templateProvider: templateProvider('ListView', listTemplate),
                resolve: {
                    view: viewProvider('ListView'),
                    data: ['$stateParams', 'RetrieveQueries', 'view', 'NgAdminConfiguration', function ($stateParams, RetrieveQueries, view, Configuration) {
                        var config = Configuration(),
                            searchParams = $stateParams.search,
                            quickFilters,
                            page = $stateParams.page,
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir,
                            quickFilter = $stateParams.quickFilter;

                        if (quickFilter) {
                            quickFilters = view.getQuickFilterParams(quickFilter);
                        }

                        return RetrieveQueries.getAll(view, page, true, searchParams, sortField, sortDir, quickFilters);
                    }]
                }
            });

        $stateProvider
            .state('show', {
                parent: 'main',
                url: '/show/:entity/:id',
                controller: 'ShowController',
                controllerAs: 'showController',
                templateProvider: templateProvider('ShowView', showTemplate),
                params: {
                    entity: {},
                    id: null
                },
                resolve: {
                    view: viewProvider('ShowView'),
                    rawEntry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }],
                    referencedValues: ['RetrieveQueries', 'view', function (RetrieveQueries, view) {
                        return RetrieveQueries.getReferencedValues(view);
                    }],
                    referencedListValues: ['$stateParams', 'RetrieveQueries', 'view', 'rawEntry', function ($stateParams, RetrieveQueries, view, rawEntry) {
                        var sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return RetrieveQueries.getReferencedListValues(view, sortField, sortDir, rawEntry.identifierValue);
                    }],
                    entry: ['RetrieveQueries', 'rawEntry', 'referencedValues', function(RetrieveQueries, rawEntry, referencedValues) {
                        return RetrieveQueries.fillReferencesValuesFromEntry(rawEntry, referencedValues, true);
                    }]
                }
            });

        $stateProvider
            .state('create', {
                parent: 'main',
                url: '/create/:entity',
                controller: 'FormController',
                controllerAs: 'formController',
                templateProvider: templateProvider('CreateView', createTemplate),
                resolve: {
                    view: viewProvider('CreateView'),
                    entry: ['view', function (view) {
                        var entry = view
                            .mapEntry({});

                        view.processFieldsDefaultValue(entry);

                        return entry;
                    }],
                    referencedValues: ['RetrieveQueries', 'view', function (RetrieveQueries, view) {
                        return RetrieveQueries.getReferencedValues(view);
                    }]
                }
            });

        $stateProvider
            .state('edit', {
                parent: 'main',
                url: '/edit/:entity/:id?sortField&sortDir',
                controller: 'FormController',
                controllerAs: 'formController',
                templateProvider: templateProvider('EditView', editTemplate),
                params: {
                    entity: {},
                    id: null,
                    sortField: null,
                    sortDir: null
                },
                resolve: {
                    view: viewProvider('EditView'),
                    entry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }],
                    referencedValues: ['RetrieveQueries', 'view', 'entry', function (RetrieveQueries, view, entry) {
                        return RetrieveQueries.getReferencedValues(view, null);
                    }],
                    referencedListValues: ['$stateParams', 'RetrieveQueries', 'view', 'entry', function ($stateParams, RetrieveQueries, view, entry) {
                        var sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return RetrieveQueries.getReferencedListValues(view, sortField, sortDir, entry.identifierValue);
                    }]
                }
            });

        $stateProvider
            .state('delete', {
                parent: 'main',
                url: '/delete/:entity/:id',
                controller: 'DeleteController',
                controllerAs: 'deleteController',
                templateProvider: templateProvider('DeleteView', deleteTemplate),
                resolve: {
                    view: viewProvider('DeleteView'),
                    params: ['$stateParams', function ($stateParams) {
                        return $stateParams;
                    }],
                    entry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }]
                }
            });

    }

    routing.$inject = ['$stateProvider'];

    return routing;
});
