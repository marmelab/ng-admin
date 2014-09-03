define(
    [
        'angular',
        'config',

        'app/Main/component/controller/AppController',
        'app/Main/component/controller/DashboardController',
        'app/Main/component/controller/SidebarController',

        'app/Main/component/service/PanelBuilder',
        'app/Main/component/service/Spinner',

        'app/Main/component/filter/OrderField',

        'app/Main/config/routing',

        'app/Main/run/StateSpinner',

        'angular-ui-router', 'famous-angular', 'restangular'
    ],
    function (
        angular,
        config,

        AppController,
        DashboardController,
        SidebarController,

        PanelBuilder,
        Spinner,

        OrderField,

        routing,

        stateSpinner
        ) {
        "use strict";

        var MainModule = angular.module('main', ['ui.router', 'restangular']);
        MainModule.constant('config', config);

        MainModule.controller('AppController', AppController);
        MainModule.controller('DashboardController', DashboardController);
        MainModule.controller('SidebarController', SidebarController);

        MainModule.service('PanelBuilder', PanelBuilder);
        MainModule.service('Spinner', Spinner);

        MainModule.filter('orderField', OrderField);

        MainModule.config(routing);

        MainModule.run(stateSpinner);

        return MainModule;
    }
);
