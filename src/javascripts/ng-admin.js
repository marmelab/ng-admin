require('./ng-admin/Main/MainModule');
require('./ng-admin/Crud/CrudModule');

import Factory from 'admin-config/lib/Factory';

var factory = angular.module('AdminDescriptionModule', []);
factory.constant('AdminDescription', new Factory());

var ngadmin = angular.module('ng-admin', ['ui.select', 'main', 'crud', 'AdminDescriptionModule']);
ngadmin.config(function(NgAdminConfigurationProvider, AdminDescription) {
    NgAdminConfigurationProvider.setAdminDescription(AdminDescription);
});

ngadmin.config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
});
