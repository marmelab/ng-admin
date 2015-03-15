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
            var customTemplate;
            var view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
            customTemplate = view.template();
            if (customTemplate) return customTemplate;
            customTemplate = Configuration().customTemplate()(viewName);
            if (customTemplate) return customTemplate;
            return defaultView;
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
                url: '/list/:entity?{search:json}&page&sortField&sortDir',
                params: {
                    entity: null,
                    page: null,
                    search: null,
                    sortField: null,
                    sortDir: null
                },
                controller: 'ListController',
                controllerAs: 'listController',
                templateProvider: templateProvider('ListView', listTemplate),
                resolve: {
                    view: viewProvider('ListView'),
                    data: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        var page = $stateParams.page,
                            filters = $stateParams.search,
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return RetrieveQueries.getAll(view, page, true, filters, sortField, sortDir);
                    }],
                    referencedValues: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getReferencedValues(view.getFilterReferences());
                    }]
                }
            });

        $stateProvider
            .state('show', {
                parent: 'main',
                url: '/show/:entity/:id?sortField&sortDir',
                controller: 'ShowController',
                controllerAs: 'showController',
                templateProvider: templateProvider('ShowView', showTemplate),
                params: {
                    entity: {},
                    id: null,
                    sortField: null,
                    sortDir: null
                },
                resolve: {
                    view: viewProvider('ShowView'),
                    rawEntry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }],
                    referencedValues: ['RetrieveQueries', 'view', 'rawEntry', function (RetrieveQueries, view, rawEntry) {
                        return RetrieveQueries.getReferencedValues(view.getReferences(), [rawEntry.values]);
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
                        return RetrieveQueries.getReferencedValues(view.getReferences());
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
                    rawEntry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }],
                    referencedValues: ['RetrieveQueries', 'view', 'rawEntry', function (RetrieveQueries, view, rawEntry) {
                        return RetrieveQueries.getReferencedValues(view.getReferences(), null);
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
