var factory = new (require('admin-config/lib/Factory'))(),
    listLayoutTemplate = require('./list/listLayout.html'),
    listTemplate = require ('./list/list.html'),
    showTemplate = require('./show/show.html'),
    createTemplate = require('./form/create.html'),
    editTemplate = require('./form/edit.html'),
    deleteTemplate = require('./delete/delete.html'),
    batchDeleteTemplate = require('./delete/batchDelete.html');

function templateProvider(viewName, defaultView) {
    return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, configuration) {
        var customTemplate;
        var view = configuration.getViewByEntityAndType($stateParams.entity, viewName);
        customTemplate = view.template();
        if (customTemplate) return customTemplate;
        customTemplate = configuration.customTemplate()(viewName);
        if (customTemplate) return customTemplate;
        return defaultView;
    }];
}

function viewProvider(viewName) {
    return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, configuration) {
        var view;
        try {
            view = configuration.getViewByEntityAndType($stateParams.entity, viewName);
        } catch (e) {
            var error404 = new Error('Unknown view or entity name');
            error404.status = 404; // trigger the 404 error
            throw error404;
        }
        if (!view.enabled) {
            throw new Error('The ' + viewName + ' is disabled for this entity');
        }
        return view;
    }];
}

function dataStoreProvider() {
    return factory.getDataStore;
}

function routing($stateProvider) {
    $stateProvider
        .state('listLayout', {
            abstract: true,
            url: '/:entity/list',
            params: {
                entity: null
            },
            parent: 'main',
            controller: 'ListLayoutController',
            controllerAs: 'llCtrl',
            templateProvider: templateProvider('ListView', listLayoutTemplate),
            resolve: {
                dataStore: dataStoreProvider(),
                view: viewProvider('ListView'),
                filterData: ['ReadQueries', 'view', function (ReadQueries, view) {
                    return ReadQueries.getAllReferencedData(view.getFilterReferences(false));
                }],
                filterEntries: ['dataStore', 'view', 'filterData', function (dataStore, view, filterData) {
                    var filters = view.getFilterReferences(false);
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
        })
        .state('list', {
            url: '?{search:json}&page&sortField&sortDir',
            params: {
                page: null,
                search: null,
                sortField: null,
                sortDir: null
            },
            parent: 'listLayout',
            views: {
                grid: {
                    controller: 'ListController',
                    controllerAs: 'listController',
                    template: listTemplate,
                    resolve: {
                        dataStore: dataStoreProvider(),
                        view: viewProvider('ListView'),
                        response: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                            var page = $stateParams.page,
                                filters = $stateParams.search,
                                sortField = $stateParams.sortField,
                                sortDir = $stateParams.sortDir;

                            return ReadQueries.getAll(view, page, filters, sortField, sortDir);
                        }],
                        totalItems: ['response', function (response) {
                            return response.totalItems;
                        }],
                        nonOptimizedReferencedData: ['ReadQueries', 'view', 'response', function (ReadQueries, view, response) {
                            return ReadQueries.getFilteredReferenceData(view.getNonOptimizedReferences(), response.data);
                        }],
                        optimizedReferencedData: ['ReadQueries', 'view', 'response', function (ReadQueries, view, response) {
                            return ReadQueries.getOptimizedReferencedData(view.getOptimizedReferences(), response.data);
                        }],
                        referencedEntries: ['dataStore', 'view', 'nonOptimizedReferencedData', 'optimizedReferencedData', function (dataStore, view, nonOptimizedReferencedData, optimizedReferencedData) {
                            var references = view.getReferences(),
                                referencedData = angular.extend(nonOptimizedReferencedData, optimizedReferencedData),
                                referencedEntries;

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
                    }
                }
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
                entity: null,
                id: null,
                page: null,
                search: null,
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: dataStoreProvider(),
                view: viewProvider('ShowView'),
                rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                    return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl());
                }],
                entry: ['dataStore', 'view', 'rawEntry', function(dataStore, view, rawEntry) {
                    return dataStore.mapEntry(
                        view.entity.name(),
                        view.identifier(),
                        view.getFields(),
                        rawEntry
                    );
                }],
                nonOptimizedReferencedData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                    return ReadQueries.getFilteredReferenceData(view.getNonOptimizedReferences(), [entry.values]);
                }],
                optimizedReferencedData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                    return ReadQueries.getOptimizedReferencedData(view.getOptimizedReferences(), [entry.values]);
                }],
                referencedEntries: ['dataStore', 'view', 'nonOptimizedReferencedData', 'optimizedReferencedData', function (dataStore, view, nonOptimizedReferencedData, optimizedReferencedData) {
                    var references = view.getReferences(),
                        referencedData = angular.extend(nonOptimizedReferencedData, optimizedReferencedData),
                        referencedEntries;

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
                referencedListData: ['$stateParams', 'ReadQueries', 'view', 'entry', function ($stateParams, ReadQueries, view, entry) {
                    var referencedLists = view.getReferencedLists();
                    var sortField = $stateParams.sortField;
                    var sortDir = $stateParams.sortDir;

                    return ReadQueries.getReferencedListData(referencedLists, sortField, sortDir, entry.identifierValue);
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
            params: {
                page: null,
                search: null,
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: dataStoreProvider(),
                view: viewProvider('CreateView'),
                entry: ['dataStore', 'view', function (dataStore, view) {
                    var entry = dataStore.createEntry(view.entity.name(), view.identifier(), view.getFields());
                    dataStore.addEntry(view.getEntity().uniqueId, entry);

                    return entry;
                }],
                choiceData: ['ReadQueries', 'view', function (ReadQueries, view) {
                    return ReadQueries.getAllReferencedData(view.getReferences(false));
                }],
                choiceEntries: ['dataStore', 'view', 'choiceData', function (dataStore, view, filterData) {
                    var choices = view.getReferences(false);
                    var choiceEntries;

                    for (var name in filterData) {
                        choiceEntries = dataStore.mapEntries(
                            choices[name].targetEntity().name(),
                            choices[name].targetEntity().identifier(),
                            [choices[name].targetField()],
                            filterData[name]
                        );

                        dataStore.setEntries(
                            choices[name].targetEntity().uniqueId + '_choices',
                            choiceEntries
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
                entity: null,
                id: null,
                page: null,
                search: null,
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: dataStoreProvider(),
                view: viewProvider('EditView'),
                rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                    return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl());
                }],
                entry: ['dataStore', 'view', 'rawEntry', function(dataStore, view, rawEntry) {
                    return dataStore.mapEntry(
                        view.entity.name(),
                        view.identifier(),
                        view.getFields(),
                        rawEntry
                    );
                }],
                nonOptimizedReferencedData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                    return ReadQueries.getFilteredReferenceData(view.getNonOptimizedReferences(), [entry.values]);
                }],
                optimizedReferencedData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                    return ReadQueries.getOptimizedReferencedData(view.getOptimizedReferences(), [entry.values]);
                }],
                referencedEntries: ['dataStore', 'view', 'nonOptimizedReferencedData', 'optimizedReferencedData', function (dataStore, view, nonOptimizedReferencedData, optimizedReferencedData) {
                    var references = view.getReferences(),
                        referencedData = angular.extend(nonOptimizedReferencedData, optimizedReferencedData),
                        referencedEntries;

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
                referencedListData: ['$stateParams', 'ReadQueries', 'view', 'entry', function ($stateParams, ReadQueries, view, entry) {
                    var referencedLists = view.getReferencedLists();
                    var sortField = $stateParams.sortField;
                    var sortDir = $stateParams.sortDir;

                    return ReadQueries.getReferencedListData(referencedLists, sortField, sortDir, entry.identifierValue);
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
                }],
                choiceData: ['ReadQueries', 'view', function (ReadQueries, view) {
                    return ReadQueries.getAllReferencedData(view.getReferences(false));
                }],
                choiceEntries: ['dataStore', 'view', 'choiceData', function (dataStore, view, filterData) {
                    var choices = view.getReferences(false);
                    var choiceEntries;

                    for (var name in filterData) {
                        choiceEntries = dataStore.mapEntries(
                            choices[name].targetEntity().name(),
                            choices[name].targetEntity().identifier(),
                            [choices[name].targetField()],
                            filterData[name]
                        );

                        dataStore.setEntries(
                            choices[name].targetEntity().uniqueId + '_choices',
                            choiceEntries
                        );
                    }

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
            params: {
                page: null,
                search: null,
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: dataStoreProvider(),
                view: viewProvider('DeleteView'),
                params: ['$stateParams', function ($stateParams) {
                    return $stateParams;
                }],
                rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                    return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl());
                }],
                entry: ['dataStore', 'view', 'rawEntry', function(dataStore, view, rawEntry) {
                    return dataStore.mapEntry(
                        view.entity.name(),
                        view.identifier(),
                        view.getFields(),
                        rawEntry
                    );
                }],
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
                entity: null,
                ids: [],
                page: null,
                search: null,
                sortField: null,
                sortDir: null
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

module.exports = routing;
