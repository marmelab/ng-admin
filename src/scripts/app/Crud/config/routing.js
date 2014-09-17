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
                url: '/list/:entity?q&page',
                params: {
                    entity: {},
                    q: null,
                    page: 1
                },
                controller: 'ListController',
                controllerAs: 'listController',
                template: listTemplate,
                resolve: {
                    data: function($stateParams, CrudManager) {
                        var page = $stateParams.page;
                        var query = $stateParams.q;

                        return CrudManager.getAll($stateParams.entity, page, null, true, query);
                    }
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
                    data: function($stateParams, CrudManager) {
                        return CrudManager.getEditionFields($stateParams.entity, 'editable');
                    },
                    referencedValues: function($stateParams, CrudManager) {
                        return CrudManager.getReferencedValues($stateParams.entity);
                    }
                }
            });

        $stateProvider
            .state('edit', {
                parent: 'main',
                url: '/edit/:entity/:id',
                controller: 'FormController',
                controllerAs: 'formController',
                template: editTemplate,
                resolve: {
                    data: function($stateParams, CrudManager) {
                        return CrudManager.getOne($stateParams.entity, $stateParams.id);
                    },
                    referencedValues: function($stateParams, CrudManager) {
                        return CrudManager.getReferencedValues($stateParams.entity);
                    },
                    referencedListValues: function($stateParams, CrudManager, data) {
                        return CrudManager.getReferencedListValues($stateParams.entity, data);
                    }
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
                    params: function($stateParams) {
                        return $stateParams;
                    }
                }
            });

    };

    routing.$inject = ['$stateProvider'];

    return routing;
});
