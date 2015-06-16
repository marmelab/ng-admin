var angular = require('angular');

var CrudModule = angular.module('crud', [
    'ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular', 'ngInflection', 'ui.codemirror', 'ngFileUpload', 'ngNumeraljs'
]);

CrudModule.controller('ListController', require('./list/ListController'));
CrudModule.controller('ShowController', require('./show/ShowController'));
CrudModule.controller('FormController', require('./form/FormController'));
CrudModule.controller('DeleteController', require('./delete/DeleteController'));
CrudModule.controller('BatchDeleteController', require('./delete/BatchDeleteController'));

CrudModule.service('EntryFormatter', require('./misc/EntryFormatter'));
CrudModule.service('PromisesResolver', require('./misc/PromisesResolver'));
CrudModule.service('ReadQueries', require('./repository/ReadQueries'));
CrudModule.service('WriteQueries', require('./repository/WriteQueries'));

CrudModule.service('RestWrapper', require('./misc/RestWrapper'));

CrudModule.directive('maJsonValidator', require('./validator/maJsonValidator'));

CrudModule.directive('maField', require('./field/maField'));
CrudModule.directive('maButtonField', require('./field/maButtonField'));
CrudModule.directive('maChoiceField', require('./field/maChoiceField'));
CrudModule.directive('maChoicesField', require('./field/maChoicesField'));
CrudModule.directive('maDateField', require('./field/maDateField'));
CrudModule.directive('maInputField', require('./field/maInputField'));
CrudModule.directive('maJsonField', require('./field/maJsonField'));
CrudModule.directive('maFileField', require('./field/maFileField'));
CrudModule.directive('maCheckboxField', require('./field/maCheckboxField'));
CrudModule.directive('maReferenceField', require('./field/maReferenceField'));
CrudModule.directive('maReferenceManyField', require('./field/maReferenceManyField'));
CrudModule.directive('maTextField', require('./field/maTextField'));
CrudModule.directive('maWysiwygField', require('./field/maWysiwygField'));
CrudModule.directive('maTemplateField', require('./field/maTemplateField'));
CrudModule.directive('uiSelectRequired', require('./field/uiSelectRequired'));

CrudModule.provider('FieldViewConfiguration', require('./fieldView/FieldViewConfiguration'));

CrudModule.directive('listActions', require('./list/ListActions'));
CrudModule.directive('maDatagrid', require('./list/maDatagrid'));
CrudModule.directive('maDatagridPagination', require('./list/maDatagridPagination'));
CrudModule.directive('maDatagridInfinitePagination', require('./list/maDatagridInfinitePagination'));
CrudModule.directive('maDatagridItemSelector', require('./list/maDatagridItemSelector'));
CrudModule.directive('maDatagridMultiSelector', require('./list/maDatagridMultiSelector'));
CrudModule.directive('maFilter', require('./filter/maFilter'));

CrudModule.directive('maColumn', require('./column/maColumn'));
CrudModule.directive('maBooleanColumn', require('./column/maBooleanColumn'));
CrudModule.directive('maChoicesColumn', require('./column/maChoicesColumn'));
CrudModule.directive('maDateColumn', require('./column/maDateColumn'));
CrudModule.directive('maJsonColumn', require('./column/maJsonColumn'));
CrudModule.directive('maNumberColumn', require('./column/maNumberColumn'));
CrudModule.directive('maReferenceManyColumn', require('./column/maReferenceManyColumn'));
CrudModule.directive('maReferenceManyLinkColumn', require('./column/maReferenceManyLinkColumn'));
CrudModule.directive('maStringColumn', require('./column/maStringColumn'));
CrudModule.directive('maTemplateColumn', require('./column/maTemplateColumn'));
CrudModule.directive('maWysiwygColumn', require('./column/maWysiwygColumn'));

CrudModule.directive('maBackButton', require('./button/maBackButton'));
CrudModule.directive('maCreateButton', require('./button/maCreateButton'));
CrudModule.directive('maEditButton', require('./button/maEditButton'));
CrudModule.directive('maFilteredListButton', require('./button/maFilteredListButton'));
CrudModule.directive('maShowButton', require('./button/maShowButton'));
CrudModule.directive('maListButton', require('./button/maListButton'));
CrudModule.directive('maDeleteButton', require('./button/maDeleteButton'));
CrudModule.directive('maBatchDeleteButton', require('./button/maBatchDeleteButton'));
CrudModule.directive('maExportToCsvButton', require('./button/maExportToCsvButton'));

CrudModule.directive('maViewActions', require('./misc/ViewActions'));
CrudModule.directive('maViewBatchActions', require('./misc/ViewBatchActions'));
CrudModule.directive('compile', require('./misc/Compile'));

CrudModule.config(require('./routing'));
CrudModule.config(require('./config/factories'));

CrudModule.factory('Papa', function () {
    return require('papaparse');
});

CrudModule.factory('notification', function () {
    var humane = require('humane-js');
    humane.timeout = 5000;
    humane.clickToClose = true;
    return humane;
});

CrudModule.factory('progression', function () {
    return require('nprogress');
});

module.exports = CrudModule;
