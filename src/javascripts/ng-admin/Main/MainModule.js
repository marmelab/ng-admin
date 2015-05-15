/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular');

    require('angular-ui-router');
    require('restangular');

    var MainModule = angular.module('main', ['ui.router', 'restangular']);

    MainModule.controller('AppController', require('ng-admin/Main/component/controller/AppController'));
    MainModule.controller('DashboardController', require('ng-admin/Main/component/controller/DashboardController'));

    MainModule.service('PanelBuilder', require('ng-admin/Main/component/service/PanelBuilder'));

    MainModule.provider('NgAdminConfiguration', require('ng-admin/Main/component/provider/NgAdminConfiguration'));

    MainModule.filter('stripTags', require('ng-admin/Main/component/filter/StripTags'));

    MainModule.directive('maDashboardPanel', require('ng-admin/Main/component/directive/maDashboardPanel'));
    MainModule.directive('maMenuBar', require('ng-admin/Main/component/directive/maMenuBar'));

    MainModule.config(require('ng-admin/Main/config/http'));
    MainModule.config(require('ng-admin/Main/config/routing'));

    MainModule.run(require('ng-admin/Main/run/ErrorHandler'));
    MainModule.run(require('ng-admin/Main/run/Loader'));

    return MainModule;
});
