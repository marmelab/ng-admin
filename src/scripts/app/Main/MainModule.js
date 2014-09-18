define(
    [
        'angular',

        'app/Main/component/controller/AppController',
        'app/Main/component/controller/DashboardController',
        'app/Main/component/controller/SidebarController',

        'app/Main/component/service/PanelBuilder',
        'app/Main/component/service/Validator',

        'app/Main/component/service/config/Application',
        'app/Main/component/service/config/Entity',
        'app/Main/component/service/config/Field',
        'app/Main/component/service/config/Reference',
        'app/Main/component/service/config/ReferencedList',
        'app/Main/component/service/config/ReferenceMany',

        'app/Main/component/provider/Configuration',

        'app/Main/component/filter/OrderElement',

        'app/Main/config/routing',

        'app/Main/run/Loader',

        'angular-ui-router', 'restangular'
    ],
    function (
        angular,

        AppController,
        DashboardController,
        SidebarController,

        PanelBuilder,
        Validator,

        Application,
        Entity,
        Field,
        Reference,
        ReferencedList,
        ReferenceMany,

        Configuration,

        OrderElement,

        routing,

        loader
        ) {
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

        MainModule.provider('Configuration', Configuration);

        MainModule.filter('orderElement', OrderElement);

        MainModule.config(routing);

        MainModule.run(loader);

        return MainModule;
    }
);
