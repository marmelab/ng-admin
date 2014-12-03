/*global define*/

define(function (require) {
    'use strict';

    var datagridView = require('text!./Datagrid.html'),
        DatagridController = require('./DatagridController');

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
