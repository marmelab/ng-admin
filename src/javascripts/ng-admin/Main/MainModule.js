define(function (require) {
    var angular = require('angular'),
        AppController = require('ng-admin/Main/component/controller/AppController'),
        DashboardController = require('ng-admin/Main/component/controller/DashboardController'),
        SidebarController = require('ng-admin/Main/component/controller/SidebarController'),

        PanelBuilder = require('ng-admin/Main/component/service/PanelBuilder'),
        Validator = require('ng-admin/Main/component/service/Validator'),

        Application = require('ng-admin/Main/component/service/config/Application'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList'),
        ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany'),

        NgAdminConfiguration = require('ng-admin/Main/component/provider/NgAdminConfiguration'),

        OrderElement = require('ng-admin/Main/component/filter/OrderElement'),

        routing = require('ng-admin/Main/config/routing'),

        loader = require('ng-admin/Main/run/Loader');

    require('angular-ui-router');
    require('restangular');

    "use strict";

    var MainModule = angular.module('main', ['ui.router', 'restangular']);

    MainModule.controller('AppController', AppController);
    MainModule.controller('DashboardController', DashboardController);
    MainModule.controller('SidebarController', SidebarController);

    MainModule.service('PanelBuilder', PanelBuilder);
    MainModule.service('Validator', Validator);

    MainModule.constant('Application', Application);
    MainModule.constant('Entity', Entity);
    MainModule.constant('Field', Field);
    MainModule.constant('Reference', Reference);
    MainModule.constant('ReferencedList', ReferencedList);
    MainModule.constant('ReferenceMany', ReferenceMany);

    MainModule.provider('NgAdminConfiguration', NgAdminConfiguration);

    MainModule.filter('orderElement', OrderElement);

    MainModule.config(routing);

    MainModule.run(loader);

    return MainModule;
});
