define(function (require) {
    "use strict";

    var angular = require('angular');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');
    require('angular-file-upload');
    require('textangular');

    var CrudModule = angular.module('crud', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular', 'angularFileUpload']);

    CrudModule.controller('ListController', require('ng-admin/Crud/component/controller/ListController'));
    CrudModule.controller('FormController', require('ng-admin/Crud/component/controller/FormController'));
    CrudModule.controller('DeleteController', require('ng-admin/Crud/component/controller/DeleteController'));

    CrudModule.service('CrudManager', require('ng-admin/Crud/component/service/CrudManager'));

    CrudModule.factory('notification', function () {
        return require('humane');
    });
    CrudModule.factory('progress', function () {
        return require('nprogress');
    });

    CrudModule.directive('compile', require('ng-admin/Crud/component/directive/Compile'));

    CrudModule.directive('stringField', require('ng-admin/Crud/component/directive/field/StringField'));
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
    CrudModule.directive('callbackField', require('ng-admin/Crud/component/directive/field/CallbackField'));
    CrudModule.directive('fileField', require('ng-admin/Crud/component/directive/field/FileField'));

    CrudModule.directive('stringColumn', require('ng-admin/Crud/component/directive/column/StringColumn'));
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
    CrudModule.directive('callbackColumn', require('ng-admin/Crud/component/directive/column/CallbackColumn'));

    CrudModule.directive('datagrid', require('ng-admin/Crud/component/directive/Datagrid'));
    CrudModule.directive('datagridPagination', require('ng-admin/Crud/component/directive/DatagridPagination'));
    CrudModule.directive('quickFilter', require('ng-admin/Crud/component/directive/QuickFilter'));

    CrudModule.run(require('ng-admin/Crud/run/cacheTemplate'));

    CrudModule.config(require('ng-admin/Crud/config/routing'));

    /**
     * Date Picker patch
     * https://github.com/angular-ui/bootstrap/commit/42cc3f269bae020ba17b4dcceb4e5afaf671d49b
     */
    CrudModule.config(['$provide', function($provide){
        $provide.decorator('dateParser', function($delegate){

            var oldParse = $delegate.parse;
            $delegate.parse = function(input, format) {
                if ( !angular.isString(input) || !format ) {
                    return input;
                }
                return oldParse.apply(this, arguments);
            };

            return $delegate;
        });
    }]);

    return CrudModule;
});
