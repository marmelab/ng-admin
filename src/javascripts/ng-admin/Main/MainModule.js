import angular from 'angular';

require('angular-ui-router');
require('restangular');

var MainModule = angular.module('main', ['ui.router', 'restangular', 'pascalprecht.translate']);

MainModule.controller('AppController', require('./component/controller/AppController'));
MainModule.controller('DashboardController', require('./component/controller/DashboardController'));
MainModule.provider('NgAdminConfiguration', require('./component/provider/NgAdminConfiguration'));
MainModule.factory('httpErrorService', require('./component/provider/HttpErrorService'));

MainModule.filter('orderElement', require('./component/filter/OrderElement'));
MainModule.filter('stripTags', require('./component/filter/StripTags'));

MainModule.directive('maDashboardPanel', require('./component/directive/maDashboardPanel'));
MainModule.directive('maMenuBar', require('./component/directive/maMenuBar'));

MainModule.config(require('./config/http'));
MainModule.config(require('./config/routing'));
MainModule.config(require('./config/translate'));

MainModule.run(require('./run/HttpErrorHandler'));
MainModule.run(require('./run/Loader'));
