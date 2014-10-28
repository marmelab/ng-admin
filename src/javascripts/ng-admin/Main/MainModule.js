define(function (require) {
    var angular = require('angular');

    require('angular-ui-router');
    require('restangular');

    "use strict";

    var MainModule = angular.module('main', ['ui.router', 'restangular']);

    MainModule.controller('AppController', require('ng-admin/Main/component/controller/AppController'));
    MainModule.controller('DashboardController', require('ng-admin/Main/component/controller/DashboardController'));
    MainModule.controller('SidebarController', require('ng-admin/Main/component/controller/SidebarController'));

    MainModule.service('PanelBuilder', require('ng-admin/Main/component/service/PanelBuilder'));
    MainModule.service('Validator', require('ng-admin/Main/component/service/Validator'));

    MainModule.constant('Application', require('ng-admin/Main/component/service/config/Application'));
    MainModule.constant('Entity', require('ng-admin/Main/component/service/config/Entity'));
    MainModule.constant('Field', require('ng-admin/Main/component/service/config/Field'));
    MainModule.constant('Reference', require('ng-admin/Main/component/service/config/Reference'));
    MainModule.constant('ReferencedList', require('ng-admin/Main/component/service/config/ReferencedList'));
    MainModule.constant('ReferenceMany', require('ng-admin/Main/component/service/config/ReferenceMany'));
    MainModule.constant('Action', require('ng-admin/Main/component/service/config/Action'));

    // Configuration view
    MainModule.constant('DashboardView', require('ng-admin/Main/component/service/config/view/DashboardView'));
    MainModule.constant('ListView', require('ng-admin/Main/component/service/config/view/ListView'));
    MainModule.constant('CreateView', require('ng-admin/Main/component/service/config/view/CreateView'));
    MainModule.constant('EditView', require('ng-admin/Main/component/service/config/view/EditView'));
    MainModule.constant('DeleteView', require('ng-admin/Main/component/service/config/view/DeleteView'));

    MainModule.provider('NgAdminConfiguration', require('ng-admin/Main/component/provider/NgAdminConfiguration'));

    MainModule.filter('orderElement', require('ng-admin/Main/component/filter/OrderElement'));

    MainModule.directive('dashboardPanel', require('ng-admin/Main/component/directive/DashboardPanel'));
    MainModule.directive('menu', require('ng-admin/Main/component/directive/Menu'));

    MainModule.config(require('ng-admin/Main/config/routing'));

    MainModule.run(require('ng-admin/Main/run/Loader'));

    return MainModule;
});
