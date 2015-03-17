/*global define*/
var inflection; // FIXME
define(function (require) {
    'use strict';

    var angular = require('angular');
    inflection = require('inflection');
    var numeral = require('numeral');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');
    require('ng-file-upload');
    require('textangular');
    require('ngInflection');
    require('angular-ui-codemirror');
    require('angular-numeraljs');

    var CrudModule = angular.module('crud', [
        'ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular', 'ngInflection', 'ui.codemirror', 'angularFileUpload', 'ngNumeraljs'
    ]);

    CrudModule.controller('ListController', require('ng-admin/Crud/list/ListController'));
    CrudModule.controller('ShowController', require('ng-admin/Crud/show/ShowController'));
    CrudModule.controller('FormController', require('ng-admin/Crud/form/FormController'));
    CrudModule.controller('DeleteController', require('ng-admin/Crud/delete/DeleteController'));

    CrudModule.service('RetrieveQueries', require('ng-admin/Crud/repository/RetrieveQueries'));
    CrudModule.service('CreateQueries', require('ng-admin/Crud/repository/CreateQueries'));
    CrudModule.service('UpdateQueries', require('ng-admin/Crud/repository/UpdateQueries'));
    CrudModule.service('DeleteQueries', require('ng-admin/Crud/repository/DeleteQueries'));

    CrudModule.directive('maJsonValidator', require('ng-admin/Crud/validator/maJsonValidator'));

    CrudModule.directive('maField', require('ng-admin/Crud/field/maField'));
    CrudModule.directive('maButtonField', require('ng-admin/Crud/field/maButtonField'));
    CrudModule.directive('maChoiceField', require('ng-admin/Crud/field/maChoiceField'));
    CrudModule.directive('maChoicesField', require('ng-admin/Crud/field/maChoicesField'));
    CrudModule.directive('maDateField', require('ng-admin/Crud/field/maDateField'));
    CrudModule.directive('maInputField', require('ng-admin/Crud/field/maInputField'));
    CrudModule.directive('maJsonField', require('ng-admin/Crud/field/maJsonField'));
    CrudModule.directive('maFileField', require('ng-admin/Crud/field/maFileField'));
    CrudModule.directive('maCheckboxField', require('ng-admin/Crud/field/maCheckboxField'));
    CrudModule.directive('maTextField', require('ng-admin/Crud/field/maTextField'));
    CrudModule.directive('maWysiwygField', require('ng-admin/Crud/field/maWysiwygField'));
    CrudModule.directive('maTemplateField', require('ng-admin/Crud/field/maTemplateField'));

    CrudModule.provider('FieldViewConfiguration', require('ng-admin/Crud/fieldView/FieldViewConfiguration'));

    CrudModule.directive('listActions', require('ng-admin/Crud/list/ListActions'));
    CrudModule.directive('maDatagrid', require('ng-admin/Crud/list/maDatagrid'));
    CrudModule.directive('maDatagridPagination', require('ng-admin/Crud/list/maDatagridPagination'));
    CrudModule.directive('maDatagridInfinitePagination', require('ng-admin/Crud/list/maDatagridInfinitePagination'));
    CrudModule.directive('maFilter', require('ng-admin/Crud/filter/maFilter'));

    CrudModule.directive('maColumn', require('ng-admin/Crud/column/maColumn'));
    CrudModule.directive('maBooleanColumn', require('ng-admin/Crud/column/maBooleanColumn'));
    CrudModule.directive('maChoicesColumn', require('ng-admin/Crud/column/maChoicesColumn'));
    CrudModule.directive('maDateColumn', require('ng-admin/Crud/column/maDateColumn'));
    CrudModule.directive('maJsonColumn', require('ng-admin/Crud/column/maJsonColumn'));
    CrudModule.directive('maNumberColumn', require('ng-admin/Crud/column/maNumberColumn'));
    CrudModule.directive('maReferenceManyColumn', require('ng-admin/Crud/column/maReferenceManyColumn'));
    CrudModule.directive('maReferenceManyLinkColumn', require('ng-admin/Crud/column/maReferenceManyLinkColumn'));
    CrudModule.directive('maStringColumn', require('ng-admin/Crud/column/maStringColumn'));
    CrudModule.directive('maTemplateColumn', require('ng-admin/Crud/column/maTemplateColumn'));
    CrudModule.directive('maWysiwygColumn', require('ng-admin/Crud/column/maWysiwygColumn'));

    CrudModule.directive('maBackButton', require('ng-admin/Crud/button/maBackButton'));
    CrudModule.directive('maCreateButton', require('ng-admin/Crud/button/maCreateButton'));
    CrudModule.directive('maEditButton', require('ng-admin/Crud/button/maEditButton'));
    CrudModule.directive('maFilteredListButton', require('ng-admin/Crud/button/maFilteredListButton'));
    CrudModule.directive('maShowButton', require('ng-admin/Crud/button/maShowButton'));
    CrudModule.directive('maListButton', require('ng-admin/Crud/button/maListButton'));
    CrudModule.directive('maDeleteButton', require('ng-admin/Crud/button/maDeleteButton'));

    CrudModule.directive('maViewActions', require('ng-admin/Crud/misc/ViewActions'));
    CrudModule.directive('compile', require('ng-admin/Crud/misc/Compile'));

    CrudModule.config(require('ng-admin/Crud/routing'));
    CrudModule.config(require('ng-admin/Crud/config/factories'));
    CrudModule.config(require('ng-admin/Crud/config/datePicker'));

    CrudModule.factory('notification', function () {
        return require('humane');
    });

    CrudModule.factory('progression', function () {
        return require('nprogress');
    });

    return CrudModule;
});
