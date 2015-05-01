/*global define*/

define(function (require) {
    'use strict';

    var listTemplate = require('text!./list/list.html'),
        showTemplate = require('text!./show/show.html'),
        createTemplate = require('text!./form/create.html'),
        editTemplate = require('text!./form/edit.html'),
        deleteTemplate = require('text!./delete/delete.html'),
        batchDeleteTemplate = require('text!./delete/batchDelete.html');

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
            var view;
            try {
                view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
            } catch (e) {
                var error404 = new Error('Unknown view or entity name');
                error404.status = 404; // trigger the 404 error
                throw error404;
            }
            if (!view.isEnabled()) {
                throw new Error('The ' + viewName + ' is disabled for this entity');
            }
            return view;
        }];
    }

    function dataStoreProvider() {
        return ['AdminDescription', function (AdminDescription) {
            return AdminDescription.getDataStore();
        }];
    }

    function routing($stateProvider) {

        $stateProvider
            .state('list', {
                parent: 'main',
                url: '/:entity/list?{search:json}&page&sortField&sortDir',
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
                    dataStore: dataStoreProvider(),
                    view: viewProvider('ListView'),
                    response: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        var page = $stateParams.page,
                            filters = $stateParams.search,
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return RetrieveQueries.getAll(view, page, filters, sortField, sortDir);
                    }],
                    totalItems: ['response', function (response) {
                        return response.totalItems;
                    }],
                    referencedData: ['RetrieveQueries', 'view', 'response', function (RetrieveQueries, view, response) {
                        return RetrieveQueries.getReferencedData(view.getReferences(), response.data);
                    }],
                    referencedEntries: ['dataStore', 'view', 'referencedData', function (dataStore, view, referencedData) {
                        var references = view.getReferences();
                        var referencedEntries;

                        for (var name in referencedData) {
                            referencedEntries = dataStore.mapEntries(
                                references[name].targetEntity().name(),
                                references[name].targetEntity().identifier(),
                                [references[name].targetField()],
                                referencedData[name]
                            );

                            dataStore.setEntries(
                                references[name].targetEntity().uniqueId + '_values',
                                referencedEntries
                            );
                        }

                        return true;
                    }],
                    entries: ['dataStore', 'view', 'response', 'referencedEntries', function (dataStore, view, response, referencedEntries) {
                        var entries = dataStore.mapEntries(
                            view.entity.name(),
                            view.identifier(),
                            view.getFields(),
                            response.data
                        );

                        // shortcut to diplay collection of entry with included referenced values
                        dataStore.fillReferencesValuesFromCollection(entries, view.getReferences(), true);

                        // set entries here ???
                        dataStore.setEntries(
                            view.getEntity().uniqueId,
                            entries
                        );

                        return true;
                    }],
                    filterData: ['RetrieveQueries', 'view', function (RetrieveQueries, view) {
                        return RetrieveQueries.getReferencedData(view.getFilterReferences());
                    }],
                    filterEntries: ['dataStore', 'view', 'filterData', function (dataStore, view, filterData) {
                        var filters = view.getFilterReferences();
                        var filterEntries;

                        for (var name in filterData) {
                            filterEntries = dataStore.mapEntries(
                                filters[name].targetEntity().name(),
                                filters[name].targetEntity().identifier(),
                                [filters[name].targetField()],
                                filterData[name]
                            );

                            dataStore.setEntries(
                                filters[name].targetEntity().uniqueId + '_choices',
                                filterEntries
                            );
                        }

                        return true;
                    }]
                }
            });

        $stateProvider
            .state('show', {
                parent: 'main',
                url: '/:entity/show/:id?sortField&sortDir',
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
                    dataStore: dataStoreProvider(),
                    view: viewProvider('ShowView'),
                    rawEntry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }],
                    entry: ['dataStore', 'view', 'rawEntry', function(dataStore, view, rawEntry) {
                        return dataStore.mapEntry(
                            view.entity.name(),
                            view.identifier(),
                            view.getFields(),
                            rawEntry
                        );
                    }],
                    referencedData: ['RetrieveQueries', 'view', 'entry', function (RetrieveQueries, view, entry) {
                        return RetrieveQueries.getReferencedData(view.getReferences(), [entry.values]);
                    }],
                    referencedEntries: ['dataStore', 'view', 'referencedData', function (dataStore, view, referencedData) {
                        var references = view.getReferences();
                        var referencedEntries;

                        for (var name in referencedData) {
                            referencedEntries = dataStore.mapEntries(
                                references[name].targetEntity().name(),
                                references[name].targetEntity().identifier(),
                                [references[name].targetField()],
                                referencedData[name]
                            );

                            dataStore.setEntries(
                                references[name].targetEntity().uniqueId + '_values',
                                referencedEntries
                            );
                        }

                        return true;
                    }],
                    referencedListData: ['$stateParams', 'RetrieveQueries', 'view', 'entry', function ($stateParams, RetrieveQueries, view, entry) {
                        var referencedLists = view.getReferencedLists();
                        var sortField = $stateParams.sortField;
                        var sortDir = $stateParams.sortDir;

                        return RetrieveQueries.getReferencedListData(referencedLists, sortField, sortDir, entry.identifierValue);
                    }],
                    referencedListEntries: ['dataStore', 'view', 'referencedListData', function (dataStore, view, referencedListData) {
                        var referencedLists = view.getReferencedLists();
                        var referencedList;
                        var referencedListEntries;

                        for (var i in referencedLists) {
                            referencedList = referencedLists[i];
                            referencedListEntries = referencedListData[i];

                            referencedListEntries = dataStore.mapEntries(
                                referencedList.targetEntity().name(),
                                referencedList.targetEntity().identifier(),
                                referencedList.targetFields(),
                                referencedListEntries
                            );

                            dataStore.setEntries(
                                referencedList.targetEntity().uniqueId + '_list',
                                referencedListEntries
                            );
                        }
                    }],
                    entryWithReferences: ['dataStore', 'view', 'entry', 'referencedEntries', function(dataStore, view, entry, referencedEntries) {
                        dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);

                        dataStore.addEntry(view.getEntity().uniqueId, entry);
                        return true;
                    }]
                }
            });

        $stateProvider
            .state('create', {
                parent: 'main',
                url: '/:entity/create',
                controller: 'FormController',
                controllerAs: 'formController',
                templateProvider: templateProvider('CreateView', createTemplate),
                resolve: {
                    dataStore: dataStoreProvider(),
                    view: viewProvider('CreateView'),
                    entry: ['dataStore', 'view', function (dataStore, view) {
                        var entry = dataStore.createEntry(view.entity.name(), view.identifier(), view.getFields());
                        dataStore.addEntry(view.getEntity().uniqueId, entry);

                        return entry;
                    }],
                    referencedData: ['RetrieveQueries', 'view', function (RetrieveQueries, view) {
                        return RetrieveQueries.getReferencedData(view.getReferences());
                    }],
                    referencedEntries: ['dataStore', 'view', 'referencedData', function (dataStore, view, referencedData) {
                        var references = view.getReferences();
                        var referencedEntries;

                        for (var name in referencedData) {
                            referencedEntries = dataStore.mapEntries(
                                references[name].targetEntity().name(),
                                references[name].targetEntity().identifier(),
                                [references[name].targetField()],
                                referencedData[name]
                            );

                            dataStore.setEntries(
                                references[name].targetEntity().uniqueId + '_choices',
                                referencedEntries
                            );
                        }

                        return true;
                    }]
                }
            });

        $stateProvider
            .state('edit', {
                parent: 'main',
                url: '/:entity/edit/:id?sortField&sortDir',
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
                    dataStore: dataStoreProvider(),
                    view: viewProvider('EditView'),
                    rawEntry: ['$stateParams', 'RetrieveQueries', 'view', function ($stateParams, RetrieveQueries, view) {
                        return RetrieveQueries.getOne(view, $stateParams.id);
                    }],
                    entry: ['dataStore', 'view', 'rawEntry', function(dataStore, view, rawEntry) {
                        return dataStore.mapEntry(
                            view.entity.name(),
                            view.identifier(),
                            view.getFields(),
                            rawEntry
                        );
                    }],
                    referencedData: ['RetrieveQueries', 'view', function (RetrieveQueries, view) {
                        return RetrieveQueries.getReferencedData(view.getReferences());
                    }],
                    referencedEntries: ['dataStore', 'view', 'referencedData', function (dataStore, view, referencedData) {
                        var references = view.getReferences();

                        var referencedEntries;
                        for (var name in referencedData) {
                            referencedEntries = dataStore.mapEntries(
                                references[name].targetEntity().name(),
                                references[name].targetEntity().identifier(),
                                [references[name].targetField()],
                                referencedData[name]
                            );

                            dataStore.setEntries(
                                references[name].targetEntity().uniqueId + '_choices',
                                referencedEntries
                            );
                        }

                        return true;
                    }],
                    referencedListData: ['$stateParams', 'RetrieveQueries', 'view', 'entry', function ($stateParams, RetrieveQueries, view, entry) {
                        var referencedLists = view.getReferencedLists();
                        var sortField = $stateParams.sortField;
                        var sortDir = $stateParams.sortDir;

                        return RetrieveQueries.getReferencedListData(referencedLists, sortField, sortDir, entry.identifierValue);
                    }],
                    referencedListEntries: ['dataStore', 'view', 'referencedListData', function (dataStore, view, referencedListData) {
                        var referencedLists = view.getReferencedLists();
                        var referencedList;
                        var referencedListEntries;

                        for (var i in referencedLists) {
                            referencedList = referencedLists[i];
                            referencedListEntries = referencedListData[i];

                            referencedListEntries = dataStore.mapEntries(
                                referencedList.targetEntity().name(),
                                referencedList.targetEntity().identifier(),
                                referencedList.targetFields(),
                                referencedListEntries
                            );

                            dataStore.setEntries(
                                referencedList.targetEntity().uniqueId + '_list',
                                referencedListEntries
                            );
                        }
                    }],
                    entryWithReferences: ['dataStore', 'view', 'entry', 'referencedEntries', function(dataStore, view, entry, referencedEntries) {
                        dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);

                        dataStore.addEntry(view.getEntity().uniqueId, entry);
                        return true;
                    }]
                }
            });

        $stateProvider
            .state('delete', {
                parent: 'main',
                url: '/:entity/delete/:id',
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

        $stateProvider
            .state('batchDelete', {
                parent: 'main',
                url: '/:entity/batch-delete/{ids:json}',
                controller: 'BatchDeleteController',
                controllerAs: 'batchDeleteController',
                templateProvider: templateProvider('BatchDeleteView', batchDeleteTemplate),
                params: {
                    entity: {},
                    ids: [],
                },
                resolve: {
                    view: viewProvider('BatchDeleteView'),
                    params: ['$stateParams', function ($stateParams) {
                        return $stateParams;
                    }]
                }
            });
    }

    routing.$inject = ['$stateProvider'];

    return routing;
});
