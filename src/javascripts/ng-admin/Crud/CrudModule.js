/*global define*/
var inflection; // FIXME
define(function (require) {
    'use strict';

    var angular = require('angular');
    inflection = require('inflection');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');
    require('textangular');
    require('ngInflection');

    var CrudModule = angular.module('crud', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular', 'ngInflection']);

    CrudModule.controller('ListController', require('ng-admin/Crud/component/controller/ListController'));
    CrudModule.controller('ShowController', require('ng-admin/Crud/component/controller/ShowController'));
    CrudModule.controller('FormController', require('ng-admin/Crud/component/controller/FormController'));
    CrudModule.controller('DeleteController', require('ng-admin/Crud/component/controller/DeleteController'));

    CrudModule.service('ListViewRepository', require('ng-admin/Crud/component/service/ListViewRepository'));
    CrudModule.service('FormViewRepository', require('ng-admin/Crud/component/service/FormViewRepository'));

    CrudModule.directive('compile', require('ng-admin/Crud/component/directive/Compile'));

    CrudModule.directive('stringField', require('ng-admin/Crud/component/directive/field/StringField'));
    CrudModule.directive('passwordField', require('ng-admin/Crud/component/directive/field/PasswordField'));
    CrudModule.directive('emailField', require('ng-admin/Crud/component/directive/field/EmailField'));
    CrudModule.directive('textField', require('ng-admin/Crud/component/directive/field/TextField'));
    CrudModule.directive('numberField', require('ng-admin/Crud/component/directive/field/NumberField'));
    CrudModule.directive('dateField', require('ng-admin/Crud/component/directive/field/DateField'));
    CrudModule.directive('booleanField', require('ng-admin/Crud/component/directive/field/BooleanField'));
    CrudModule.directive('choiceField', require('ng-admin/Crud/component/directive/field/ChoiceField'));
    CrudModule.directive('choicesField', require('ng-admin/Crud/component/directive/field/ChoicesField'));
    CrudModule.directive('referenceField', require('ng-admin/Crud/component/directive/field/ReferenceField'));
    CrudModule.directive('referenceManyField', require('ng-admin/Crud/component/directive/field/ReferenceManyField'));
    CrudModule.directive('wysiwygField', require('ng-admin/Crud/component/directive/field/WysiwygField'));
    CrudModule.directive('templateField', require('ng-admin/Crud/component/directive/field/TemplateField'));

    CrudModule.directive('stringColumn', require('ng-admin/Crud/component/directive/column/StringColumn'));
    CrudModule.directive('passwordColumn', require('ng-admin/Crud/component/directive/column/PasswordColumn'));
    CrudModule.directive('emailColumn', require('ng-admin/Crud/component/directive/column/EmailColumn'));
    CrudModule.directive('textColumn', require('ng-admin/Crud/component/directive/column/TextColumn'));
    CrudModule.directive('numberColumn', require('ng-admin/Crud/component/directive/column/NumberColumn'));
    CrudModule.directive('dateColumn', require('ng-admin/Crud/component/directive/column/DateColumn'));
    CrudModule.directive('booleanColumn', require('ng-admin/Crud/component/directive/column/BooleanColumn'));
    CrudModule.directive('choiceColumn', require('ng-admin/Crud/component/directive/column/ChoiceColumn'));
    CrudModule.directive('choicesColumn', require('ng-admin/Crud/component/directive/column/ChoicesColumn'));
    CrudModule.directive('referenceColumn', require('ng-admin/Crud/component/directive/column/ReferenceColumn'));
    CrudModule.directive('referenceManyColumn', require('ng-admin/Crud/component/directive/column/ReferenceManyColumn'));
    CrudModule.directive('wysiwygColumn', require('ng-admin/Crud/component/directive/column/WysiwygColumn'));
    CrudModule.directive('templateColumn', require('ng-admin/Crud/component/directive/column/TemplateColumn'));

    CrudModule.directive('datagrid', require('ng-admin/Crud/component/directive/Datagrid'));
    CrudModule.directive('datagridPagination', require('ng-admin/Crud/component/directive/DatagridPagination'));
    CrudModule.directive('quickFilter', require('ng-admin/Crud/component/directive/QuickFilter'));

    CrudModule.directive('backButton', require('ng-admin/Crud/component/directive/BackButton'));
    CrudModule.directive('createButton', require('ng-admin/Crud/component/directive/CreateButton'));
    CrudModule.directive('editButton', require('ng-admin/Crud/component/directive/EditButton'));
    CrudModule.directive('showButton', require('ng-admin/Crud/component/directive/ShowButton'));
    CrudModule.directive('listButton', require('ng-admin/Crud/component/directive/ListButton'));
    CrudModule.directive('deleteButton', require('ng-admin/Crud/component/directive/DeleteButton'));

    CrudModule.run(require('ng-admin/Crud/run/cacheTemplate'));

    CrudModule.config(require('ng-admin/Crud/config/routing'));

    CrudModule.factory('notification', function () {
        return require('humane');
    });

    CrudModule.factory('progression', function () {
        return require('nprogress');
    });


    /**
     * Date Picker patch
     * https://github.com/angular-ui/bootstrap/commit/42cc3f269bae020ba17b4dcceb4e5afaf671d49b
     */
    CrudModule.config(['$provide', function ($provide) {
        $provide.decorator('dateParser', function ($delegate) {

            var oldParse = $delegate.parse;
            $delegate.parse = function (input, format) {
                if (!angular.isString(input) || !format) {
                    return input;
                }

                return oldParse.apply(this, arguments);
            };

            return $delegate;
        });
    }]);

    return CrudModule;
});
