require('./ng-admin/Main/MainModule');
require('./ng-admin/Crud/CrudModule');

var Factory = require('./ng-admin/es6/lib/Factory');

var factory = angular.module('AdminDescriptionModule', []);
factory.constant('AdminDescription', new Factory());

var ngadmin = angular.module('ng-admin', ['main', 'crud', 'AdminDescriptionModule']);
ngadmin.config(function(NgAdminConfigurationProvider, AdminDescription) {
    NgAdminConfigurationProvider.setAdminDescription(AdminDescription);
});
