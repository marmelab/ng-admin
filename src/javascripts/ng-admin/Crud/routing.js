/*global define*/

define(function (require) {
    'use strict';

    var listTemplate = require('text!./list/list.html'),
        showTemplate = require('text!./show/show.html'),
        createTemplate = require('text!./form/create.html'),
        editTemplate = require('text!./form/edit.html'),
        deleteTemplate = require('text!./delete/delete.html');

    var routing = function ($stateProvider) {

        $stateProvider
            .state('list', {
                parent: 'main',
                url: '/list/:entity?search&page&sortField&sortDir&quickFilter',
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
                template: listTemplate,
                resolve: {
                    data: ['$stateParams', '$location', 'RetrieveQueries', 'NgAdminConfiguration', function ($stateParams, $location, RetrieveQueries, Configuration) {
                        var config = Configuration(),
                            listView = config.getViewByEntityAndType($stateParams.entity, 'ListView'),
                            entity = config.getEntity($stateParams.entity),
                            filterFields = entity.filterView().getFields(),
                            queryParams = $location.search(),
                            quickFilters,
                            filterName,
                            page = $stateParams.page,
                            searchParams = {},
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir,
                            quickFilter = $stateParams.quickFilter,
                            i;

                        if (!listView.isEnabled()) {
                            throw new Error('the list view is disabled for this entity');
                        }

                        for (i in filterFields) {
                            // angular-ui router doesn't handle query params like search[q]=test&search[title]=hello
                            filterName = 'search[' + i + ']';

                            if (filterName in queryParams) {
                                searchParams[i] = queryParams[filterName];
                            }
                        }

                        if (quickFilter) {
                            quickFilters = listView.getQuickFilterParams(quickFilter);
                        }

                        return RetrieveQueries.getAll(listView, page, true, searchParams, sortField, sortDir, quickFilters);
                    }]
                }
            });

        $stateProvider
            .state('show', {
                parent: 'main',
                url: '/show/:entity/:id',
                controller: 'ShowController',
                controllerAs: 'showController',
                template: showTemplate,
                params: {
                    entity: {},
                    id: null
                },
                resolve: {
                    view: ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
                        var view = Configuration().getViewByEntityAndType($stateParams.entity, 'ShowView');
                        if (!view.isEnabled()) {
                            throw new Error('the show view is disabled for this entity');
                        }
                        return view;
                    }],
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
                template: createTemplate,
                resolve: {
                    view: ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
                        var view = Configuration().getViewByEntityAndType($stateParams.entity, 'CreateView');
                        if (!view.isEnabled()) {
                            throw new Error('the creation view is disabled for this entity');
                        }
                        return view;
                    }],
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
                template: editTemplate,
                params: {
                    entity: {},
                    id: null,
                    sortField: null,
                    sortDir: null
                },
                resolve: {
                    view: ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
                        var view = Configuration().getViewByEntityAndType($stateParams.entity, 'EditView');
                        if (!view.isEnabled()) {
                            throw new Error('the edition view is disabled for this entity');
                        }
                        return view;
                    }],
                    entry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }],
                    referencedValues: ['RetrieveQueries', 'view', function (RetrieveQueries, view) {
                        return RetrieveQueries.getReferencedValues(view);
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
                template: deleteTemplate,
                resolve: {
                    params: ['$stateParams', function ($stateParams) {
                        return $stateParams;
                    }],
                    view: ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
                        var view = Configuration().getViewByEntityAndType($stateParams.entity, 'DeleteView');
                        if (!view.isEnabled()) {
                            throw new Error('the deletion view is disabled for this entity');
                        }
                        return view;
                    }],
                    entry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }]
                }
            });

    };

    routing.$inject = ['$stateProvider'];

    return routing;
});
