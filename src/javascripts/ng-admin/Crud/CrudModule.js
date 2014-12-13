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

    CrudModule.controller('ListController', require('ng-admin/Crud/list/ListController'));
    CrudModule.controller('ShowController', require('ng-admin/Crud/show/ShowController'));
    CrudModule.controller('FormController', require('ng-admin/Crud/form/FormController'));
    CrudModule.controller('DeleteController', require('ng-admin/Crud/delete/DeleteController'));

    CrudModule.service('RetrieveQueries', require('ng-admin/Crud/repository/RetrieveQueries'));
    CrudModule.service('CreateQueries', require('ng-admin/Crud/repository/CreateQueries'));
    CrudModule.service('UpdateQueries', require('ng-admin/Crud/repository/UpdateQueries'));
    CrudModule.service('DeleteQueries', require('ng-admin/Crud/repository/DeleteQueries'));

    CrudModule.directive('maChoiceField', require('ng-admin/Crud/field/maChoiceField'));
    CrudModule.directive('maChoicesField', require('ng-admin/Crud/field/maChoicesField'));
    CrudModule.directive('maDateField', require('ng-admin/Crud/field/maDateField'));
    CrudModule.directive('maInputField', require('ng-admin/Crud/field/maInputField'));
    CrudModule.directive('maReferenceField', require('ng-admin/Crud/field/maReferenceField'));
    CrudModule.directive('maReferenceManyField', require('ng-admin/Crud/field/maReferenceManyField'));
    CrudModule.directive('maTextField', require('ng-admin/Crud/field/maTextField'));
    CrudModule.directive('maWysiwygField', require('ng-admin/Crud/field/maWysiwygField'));
    CrudModule.directive('templateField', require('ng-admin/Crud/field/TemplateField'));

    CrudModule.directive('listActions', require('ng-admin/Crud/list/ListActions'));
    CrudModule.directive('datagrid', require('ng-admin/Crud/list/Datagrid'));
    CrudModule.directive('datagridPagination', require('ng-admin/Crud/list/DatagridPagination'));
    CrudModule.directive('quickFilter', require('ng-admin/Crud/list/QuickFilter'));

    CrudModule.directive('stringColumn', require('ng-admin/Crud/column/StringColumn'));
    CrudModule.directive('passwordColumn', require('ng-admin/Crud/column/PasswordColumn'));
    CrudModule.directive('emailColumn', require('ng-admin/Crud/column/EmailColumn'));
    CrudModule.directive('textColumn', require('ng-admin/Crud/column/TextColumn'));
    CrudModule.directive('numberColumn', require('ng-admin/Crud/column/NumberColumn'));
    CrudModule.directive('dateColumn', require('ng-admin/Crud/column/DateColumn'));
    CrudModule.directive('booleanColumn', require('ng-admin/Crud/column/BooleanColumn'));
    CrudModule.directive('choiceColumn', require('ng-admin/Crud/column/ChoiceColumn'));
    CrudModule.directive('choicesColumn', require('ng-admin/Crud/column/ChoicesColumn'));
    CrudModule.directive('referenceColumn', require('ng-admin/Crud/column/ReferenceColumn'));
    CrudModule.directive('referenceManyColumn', require('ng-admin/Crud/column/ReferenceManyColumn'));
    CrudModule.directive('wysiwygColumn', require('ng-admin/Crud/column/WysiwygColumn'));
    CrudModule.directive('templateColumn', require('ng-admin/Crud/column/TemplateColumn'));

    CrudModule.directive('backButton', require('ng-admin/Crud/button/BackButton'));
    CrudModule.directive('createButton', require('ng-admin/Crud/button/CreateButton'));
    CrudModule.directive('editButton', require('ng-admin/Crud/button/EditButton'));
    CrudModule.directive('showButton', require('ng-admin/Crud/button/ShowButton'));
    CrudModule.directive('listButton', require('ng-admin/Crud/button/ListButton'));
    CrudModule.directive('deleteButton', require('ng-admin/Crud/button/DeleteButton'));

    CrudModule.directive('viewActions', require('ng-admin/Crud/misc/ViewActions'));
    CrudModule.directive('compile', require('ng-admin/Crud/misc/Compile'));
    CrudModule.run(require('ng-admin/Crud/misc/cacheTemplate'));

    CrudModule.config(require('ng-admin/Crud/routing'));

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
