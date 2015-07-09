require('es6-promise').polyfill(); // for IE

require('./ng-admin/Main/MainModule');
require('./ng-admin/Crud/CrudModule');

var ngadmin = angular.module('ng-admin', ['ui.select', 'main', 'crud']);

ngadmin.config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
});
