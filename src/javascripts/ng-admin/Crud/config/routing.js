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
