define(function (require) {
    var angular = require('angular'),
        AppController = require('app/Main/component/controller/AppController'),
        DashboardController = require('app/Main/component/controller/DashboardController'),
        SidebarController = require('app/Main/component/controller/SidebarController'),

        PanelBuilder = require('app/Main/component/service/PanelBuilder'),
        Validator = require('app/Main/component/service/Validator'),

        Application = require('app/Main/component/service/config/Application'),
        Entity = require('app/Main/component/service/config/Entity'),
        Field = require('app/Main/component/service/config/Field'),
        Reference = require('app/Main/component/service/config/Reference'),
        ReferencedList = require('app/Main/component/service/config/ReferencedList'),
        ReferenceMany = require('app/Main/component/service/config/ReferenceMany'),

        NgAdminConfiguration = require('app/Main/component/provider/NgAdminConfiguration'),

        OrderElement = require('app/Main/component/filter/OrderElement'),

        routing = require('app/Main/config/routing'),

        loader = require('app/Main/run/Loader');

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
