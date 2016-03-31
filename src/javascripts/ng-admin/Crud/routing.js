import DataStore  from 'admin-config/lib/DataStore/DataStore';
import Entry  from 'admin-config/lib/Entry';
import batchDeleteTemplate  from './delete/batchDelete.html';
import deleteTemplate  from './delete/delete.html';
import createTemplate  from './form/create.html';
import editTemplate  from './form/edit.html';
import listTemplate  from './list/list.html';
import listLayoutTemplate  from './list/listLayout.html';
import showTemplate  from './show/show.html';

function templateProvider(viewName, defaultView) {
    return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
        var customTemplate;
        var view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
        customTemplate = view.template();
        if (customTemplate) {
            return customTemplate;
        }
        customTemplate = Configuration().customTemplate()(viewName);
        if (customTemplate) {
            return customTemplate;
        }
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
        if (!view.enabled) {
            throw new Error('The ' + viewName + ' is disabled for this entity');
        }
        return view;
    }];
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
                dataStore: () => new DataStore(),
                view: viewProvider('ListView'),
                filterData: ['ReadQueries', 'view', function (ReadQueries, view) {
                    return ReadQueries.getAllReferencedData(view.getFilterReferences(false));
                }],
                filterEntries: ['dataStore', 'view', 'filterData', function (dataStore, view, filterData) {
                    const filters = view.getFilterReferences(false);
                    for (var name in filterData) {
                        Entry.createArrayFromRest(
                            filterData[name],
                            [filters[name].targetField()],
                            filters[name].targetEntity().name(),
                            filters[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(filters[name].targetEntity().uniqueId + '_choices', entry));
                    }
                }]
            }
        })
        .state('list', {
            url: '?{search:json}&{page:int}&sortField&sortDir',
            params: {
                page: { value: 1, squash: true },
                search: { value: {}, squash: true },
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
                        dataStore: () => new DataStore(),
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
                        referenceData: ['ReadQueries', 'view', 'response', function (ReadQueries, view, response) {
                            return ReadQueries.getReferenceData(view.fields(), response.data);
                        }],
                        referenceEntries: ['dataStore', 'view', 'referenceData', function (dataStore, view, referenceData) {
                            const references = view.getReferences();
                            for (var name in referenceData) {
                                Entry.createArrayFromRest(
                                    referenceData[name],
                                    [references[name].targetField()],
                                    references[name].targetEntity().name(),
                                    references[name].targetEntity().identifier().name()
                                ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
                            }
                        }],
                        entries: ['dataStore', 'view', 'response', 'referenceEntries', function (dataStore, view, response, referenceEntries) {
                            var entries = view.mapEntries(response.data);

                            // shortcut to diplay collection of entry with included referenced values
                            dataStore.fillReferencesValuesFromCollection(entries, view.getReferences(), true);

                            // set entries here ???
                            dataStore.setEntries(
                                view.getEntity().uniqueId,
                                entries
                            );

                            return entries;
                        }],
                        prepare: ['view', '$stateParams', 'dataStore', 'entries', '$window', '$injector', function(view, $stateParams, dataStore, entries, $window, $injector) {
                            return view.prepare() && $injector.invoke(view.prepare(), view, {
                                query: $stateParams,
                                datastore: dataStore,
                                view,
                                Entry,
                                entries,
                                window: $window
                            });
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
                page: { value: 1, squash: true },
                search: { value: {}, squash: true },
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: () => new DataStore(),
                view: viewProvider('ShowView'),
                rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                    return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl($stateParams.id));
                }],
                entry: ['view', 'rawEntry', function(view, rawEntry) {
                    return view.mapEntry(rawEntry);
                }],
                referenceData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                    return ReadQueries.getReferenceData(view.fields(), [entry.values]);
                }],
                referenceEntries: ['dataStore', 'view', 'referenceData', function (dataStore, view, referenceData) {
                    const references = view.getReferences();
                    for (var name in referenceData) {
                        Entry.createArrayFromRest(
                            referenceData[name],
                            [references[name].targetField()],
                            references[name].targetEntity().name(),
                            references[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
                    }
                }],
                referencedListData: ['$stateParams', 'ReadQueries', 'view', 'entry', function ($stateParams, ReadQueries, view, entry) {
                    return ReadQueries.getReferencedListData(view.getReferencedLists(), $stateParams.sortField, $stateParams.sortDir, entry.identifierValue);
                }],
                referencedListEntries: ['dataStore', 'view', 'referencedListData', function (dataStore, view, referencedListData) {
                    const referencedLists = view.getReferencedLists();
                    for (var name in referencedLists) {
                        Entry.createArrayFromRest(
                            referencedListData[name],
                            referencedLists[name].targetFields(),
                            referencedLists[name].targetEntity().name(),
                            referencedLists[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(referencedLists[name].targetEntity().uniqueId + '_list', entry));
                    }
                }],
                entryWithReferences: ['dataStore', 'view', 'entry', 'referenceEntries', function(dataStore, view, entry, referenceEntries) {
                    dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);
                    dataStore.addEntry(view.getEntity().uniqueId, entry);
                }],
                referenceDataForReferencedLists: ['$q', 'ReadQueries', 'view', 'referencedListData', function ($q,ReadQueries, view, referencedListData) {
                    const referencedLists = view.getReferencedLists();
                    var promises = {};
                    Object.keys(referencedLists).map(name => {
                        promises[name] = ReadQueries.getReferenceData(referencedLists[name].targetFields(), referencedListData[name]);
                    });
                    return $q.all(promises);
                }],
                referenceEntriesForReferencedLists: ['dataStore', 'view', 'referenceDataForReferencedLists', function(dataStore, view, referenceDataForReferencedLists) {
                    const referencedLists = view.getReferencedLists();
                    Object.keys(referencedLists).map(referencedListName => {
                        const references = referencedLists[referencedListName].getReferences();
                        for (var name in references) {
                            if (!referenceDataForReferencedLists[referencedListName][name]) {
                                continue;
                            }
                            Entry.createArrayFromRest(
                                referenceDataForReferencedLists[referencedListName][name],
                                [references[name].targetField()],
                                references[name].targetEntity().name(),
                                references[name].targetEntity().identifier().name()
                            ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
                        }
                    });
                    return true;
                }],
                prepare: ['view', '$stateParams', 'dataStore', 'entry', 'entryWithReferences', 'referencedListEntries', 'referenceEntriesForReferencedLists', '$window', '$injector', function(view, $stateParams, dataStore, entry, entryWithReferences, referencedListEntries, referenceEntriesForReferencedLists, $window, $injector) {
                    return view.prepare() && $injector.invoke(view.prepare(), view, {
                        query: $stateParams,
                        datastore: dataStore,
                        view,
                        Entry,
                        entry,
                        window: $window
                    });
                }],
            }
        });

    $stateProvider
        .state('create', {
            parent: 'main',
            url: '/:entity/create?{defaultValues:json}',
            controller: 'FormController',
            controllerAs: 'formController',
            templateProvider: templateProvider('CreateView', createTemplate),
            params: {
                page: { value: 1, squash: true },
                search: { value: {}, squash: true },
                defaultValues: { value: {}, squash: true },
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: () => new DataStore(),
                previousState: ['$state', '$stateParams', ($state, $stateParams) => ({
                    name: $state.current.name || 'edit',
                    params: Object.keys($state.params).length > 0 ? $state.params : $stateParams,
                })],
                view: viewProvider('CreateView'),
                entry: ['$stateParams', 'dataStore', 'view', function ($stateParams, dataStore, view) {
                    var entry = Entry.createForFields(view.getFields(), view.entity.name());
                    Object.keys($stateParams.defaultValues).forEach(key => entry.values[key] = $stateParams.defaultValues[key]);
                    dataStore.addEntry(view.getEntity().uniqueId, entry);

                    return entry;
                }],
                choiceData: ['ReadQueries', 'view', function (ReadQueries, view) {
                    return ReadQueries.getAllReferencedData(view.getReferences(false));
                }],
                choiceEntries: ['dataStore', 'view', 'choiceData', function (dataStore, view, filterData) {
                    const choices = view.getReferences(false);
                    for (var name in filterData) {
                        Entry.createArrayFromRest(
                            filterData[name],
                            [choices[name].targetField()],
                            choices[name].targetEntity().name(),
                            choices[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(choices[name].targetEntity().uniqueId + '_choices', entry));
                    }
                }],
                prepare: ['view', '$stateParams', 'dataStore', 'entry', 'choiceEntries', '$window', '$injector', function(view, $stateParams, dataStore, entry, choiceEntries, $window, $injector) {
                    return view.prepare() && $injector.invoke(view.prepare(), view, {
                        query: $stateParams,
                        datastore: dataStore,
                        view,
                        Entry,
                        entry,
                        window: $window
                    });
                }],
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
                page: { value: 1, squash: true },
                search: { value: {}, squash: true },
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: () => new DataStore(),
                previousState: ['$state', '$stateParams', ($state, $stateParams) => ({
                    name: $state.current.name || 'edit',
                    params: Object.keys($state.params).length > 0 ? $state.params : $stateParams,
                })],
                view: viewProvider('EditView'),
                rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                    return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl($stateParams.id));
                }],
                entry: ['view', 'rawEntry', function(view, rawEntry) {
                    return view.mapEntry(rawEntry);
                }],
                referenceData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                    return ReadQueries.getReferenceData(view.fields(), [entry.values]);
                }],
                referenceEntries: ['dataStore', 'view', 'referenceData', function (dataStore, view, referenceData) {
                    const references = view.getReferences();
                    for (var name in referenceData) {
                        Entry.createArrayFromRest(
                            referenceData[name],
                            [references[name].targetField()],
                            references[name].targetEntity().name(),
                            references[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
                    }
                }],
                referencedListData: ['$stateParams', 'ReadQueries', 'view', 'entry', function ($stateParams, ReadQueries, view, entry) {
                    return ReadQueries.getReferencedListData(view.getReferencedLists(), $stateParams.sortField, $stateParams.sortDir, entry.identifierValue);
                }],
                referencedListEntries: ['dataStore', 'view', 'referencedListData', function (dataStore, view, referencedListData) {
                    const referencedLists = view.getReferencedLists();
                    for (var name in referencedLists) {
                        Entry.createArrayFromRest(
                            referencedListData[name],
                            referencedLists[name].targetFields(),
                            referencedLists[name].targetEntity().name(),
                            referencedLists[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(referencedLists[name].targetEntity().uniqueId + '_list', entry));
                    }
                }],
                entryWithReferences: ['dataStore', 'view', 'entry', 'referenceEntries', function(dataStore, view, entry, referenceEntries) {
                    dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);
                    dataStore.addEntry(view.getEntity().uniqueId, entry);
                }],
                choiceData: ['ReadQueries', 'view', function (ReadQueries, view) {
                    return ReadQueries.getAllReferencedData(view.getReferences(false));
                }],
                choiceEntries: ['dataStore', 'view', 'choiceData', function (dataStore, view, filterData) {
                    const choices = view.getReferences(false);
                    for (var name in filterData) {
                        Entry.createArrayFromRest(
                            filterData[name],
                            [choices[name].targetField()],
                            choices[name].targetEntity().name(),
                            choices[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(choices[name].targetEntity().uniqueId + '_choices', entry));
                    }
                }],
                referenceDataForReferencedLists: ['$q', 'ReadQueries', 'view', 'referencedListData', function ($q,ReadQueries, view, referencedListData) {
                    const referencedLists = view.getReferencedLists();
                    var promises = {};
                    Object.keys(referencedLists).map(name => {
                        promises[name] = ReadQueries.getReferenceData(referencedLists[name].targetFields(), referencedListData[name]);
                    });
                    return $q.all(promises);
                }],
                referenceEntriesForReferencedLists: ['dataStore', 'view', 'referenceDataForReferencedLists', function(dataStore, view, referenceDataForReferencedLists) {
                    const referencedLists = view.getReferencedLists();
                    Object.keys(referencedLists).map(referencedListName => {
                        const references = referencedLists[referencedListName].getReferences();
                        for (var name in references) {
                            if (!referenceDataForReferencedLists[referencedListName][name]) {
                                continue;
                            }
                            Entry.createArrayFromRest(
                                referenceDataForReferencedLists[referencedListName][name],
                                [references[name].targetField()],
                                references[name].targetEntity().name(),
                                references[name].targetEntity().identifier().name()
                            ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
                        }
                    });
                    return true;
                }],
                prepare: ['view', '$stateParams', 'dataStore', 'entry', 'referenceEntriesForReferencedLists', 'choiceEntries', 'entryWithReferences', '$window', '$injector', function(view, $stateParams, dataStore, entry, referenceEntriesForReferencedLists, choiceEntries, entryWithReferences, $window, $injector) {
                    return view.prepare() && $injector.invoke(view.prepare(), view, {
                        query: $stateParams,
                        datastore: dataStore,
                        view,
                        Entry,
                        entry,
                        window: $window
                    });
                }],
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
                page: { value: 1, squash: true },
                search: { value: {}, squash: true },
                sortField: null,
                sortDir: null
            },
            resolve: {
                dataStore: () => new DataStore(),
                view: viewProvider('DeleteView'),
                params: ['$stateParams', function ($stateParams) {
                    return $stateParams;
                }],
                rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                    return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl($stateParams.id));
                }],
                entry: ['view', 'rawEntry', function(view, rawEntry) {
                    return view.mapEntry(rawEntry);
                }],
                prepare: ['view', '$stateParams', 'dataStore', 'entry', '$window', '$injector', function(view, $stateParams, dataStore, entry, $window, $injector) {
                    return view.prepare() && $injector.invoke(view.prepare(), view, {
                        query: $stateParams,
                        datastore: dataStore,
                        view,
                        Entry,
                        entry,
                        window: $window
                    });

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
                page: { value: 1, squash: true },
                search: { value: {}, squash: true },
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

export default routing;
