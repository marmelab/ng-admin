require('es6-promise').polyfill(); // for IE

require('./vendors');
require('./ng-admin/Main/MainModule');
require('./ng-admin/Crud/CrudModule');

import Factory from 'admin-config/lib/Factory';

const moduleName = 'ng-admin';
const factory = angular.module('AdminDescriptionModule', []);
factory.constant('AdminDescription', new Factory());

const ngadmin = angular.module(moduleName, [
    'ui.select',
    'main',
    'crud',
    'AdminDescriptionModule'
]);

ngadmin.config(['NgAdminConfigurationProvider', 'AdminDescription', function(NgAdminConfigurationProvider, AdminDescription) {
    NgAdminConfigurationProvider.setAdminDescription(AdminDescription);
}]);

ngadmin.config(['uiSelectConfig', function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
}]);

export default moduleName;
