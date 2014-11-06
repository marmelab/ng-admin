define(function(require) {
    'use strict';

    var angular = require('angular'),
        datagridView = require('text!../../view/datagrid.html'),
        DatagridController = require('ng-admin/Crud/component/controller/directive/DatagridController');

    function DatagridDirective() {
        return {
            restrict: 'E',
            template: datagridView,
            controllerAs: 'datagrid',
            controller: DatagridController
        };
    }

    DatagridDirective.$inject = [];

    return DatagridDirective;
});
