var angular = require('angular');

require('angular-ui-router');
require('restangular');

var MainModule = angular.module('main', ['ui.router', 'restangular']);

MainModule.controller('DashboardController', require('./component/controller/DashboardController'));

MainModule.provider('NgAdminConfiguration', require('./component/provider/NgAdminConfiguration'));

MainModule.filter('orderElement', require('./component/filter/OrderElement'));
MainModule.filter('stripTags', require('./component/filter/StripTags'));

MainModule.directive('maNgAdmin', require('./component/directive/maNgAdmin'));
MainModule.directive('maDashboardPanel', require('./component/directive/maDashboardPanel'));
MainModule.directive('maMenuBar', require('./component/directive/maMenuBar'));

MainModule.config(require('./config/http'));
MainModule.config(require('./config/routing'));

MainModule.run(require('./run/ErrorHandler'));
MainModule.run(require('./run/Loader'));
