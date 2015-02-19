/*global define*/
var inflection; // FIXME
define(function (require) {
    'use strict';

    var angular = require('angular');
    inflection = require('inflection');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');
    require('ng-file-upload');
    require('textangular');
    require('ngInflection');
    require('angular-ui-codemirror');

    var CrudModule = angular.module('crud', [
        'ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular', 'ngInflection', 'ui.codemirror', 'angularFileUpload'
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
    CrudModule.constant('BooleanFieldView', require('ng-admin/Crud/fieldView/BooleanFieldView'));
    CrudModule.constant('ChoiceFieldView', require('ng-admin/Crud/fieldView/ChoiceFieldView'));
    CrudModule.constant('ChoicesFieldView', require('ng-admin/Crud/fieldView/ChoicesFieldView'));
    CrudModule.constant('DateFieldView', require('ng-admin/Crud/fieldView/DateFieldView'));
    CrudModule.constant('EmailFieldView', require('ng-admin/Crud/fieldView/EmailFieldView'));
    CrudModule.constant('JsonFieldView', require('ng-admin/Crud/fieldView/JsonFieldView'));
    CrudModule.constant('NumberFieldView', require('ng-admin/Crud/fieldView/NumberFieldView'));
    CrudModule.constant('PasswordFieldView', require('ng-admin/Crud/fieldView/PasswordFieldView'));
    CrudModule.constant('ReferencedListFieldView', require('ng-admin/Crud/fieldView/ReferencedListFieldView'));
    CrudModule.constant('ReferenceFieldView', require('ng-admin/Crud/fieldView/ReferenceFieldView'));
    CrudModule.constant('ReferenceManyFieldView', require('ng-admin/Crud/fieldView/ReferenceManyFieldView'));
    CrudModule.constant('StringFieldView', require('ng-admin/Crud/fieldView/StringFieldView'));
    CrudModule.constant('TemplateFieldView', require('ng-admin/Crud/fieldView/TemplateFieldView'));
    CrudModule.constant('TextFieldView', require('ng-admin/Crud/fieldView/TextFieldView'));
    CrudModule.constant('WysiwygFieldView', require('ng-admin/Crud/fieldView/WysiwygFieldView'));

    CrudModule.directive('listActions', require('ng-admin/Crud/list/ListActions'));
    CrudModule.directive('maDatagrid', require('ng-admin/Crud/list/maDatagrid'));
    CrudModule.directive('maDatagridPagination', require('ng-admin/Crud/list/maDatagridPagination'));
    CrudModule.directive('maFilter', require('ng-admin/Crud/filter/maFilter'));

    CrudModule.directive('maColumn', require('ng-admin/Crud/column/maColumn'));
    CrudModule.directive('maBooleanColumn', require('ng-admin/Crud/column/maBooleanColumn'));
    CrudModule.directive('maChoicesColumn', require('ng-admin/Crud/column/maChoicesColumn'));
    CrudModule.directive('maDateColumn', require('ng-admin/Crud/column/maDateColumn'));
    CrudModule.directive('maPasswordColumn', require('ng-admin/Crud/column/maPasswordColumn'));
    CrudModule.directive('maReferenceManyLinkColumn', require('ng-admin/Crud/column/maReferenceManyLinkColumn'));
    CrudModule.directive('maStringColumn', require('ng-admin/Crud/column/maStringColumn'));
    CrudModule.directive('maJsonColumn', require('ng-admin/Crud/column/maJsonColumn'));
    CrudModule.directive('maTemplateColumn', require('ng-admin/Crud/column/maTemplateColumn'));
    CrudModule.directive('maWysiwygColumn', require('ng-admin/Crud/column/maWysiwygColumn'));

    CrudModule.directive('maBackButton', require('ng-admin/Crud/button/maBackButton'));
    CrudModule.directive('maCreateButton', require('ng-admin/Crud/button/maCreateButton'));
    CrudModule.directive('maEditButton', require('ng-admin/Crud/button/maEditButton'));
    CrudModule.directive('maShowButton', require('ng-admin/Crud/button/maShowButton'));
    CrudModule.directive('maListButton', require('ng-admin/Crud/button/maListButton'));
    CrudModule.directive('maDeleteButton', require('ng-admin/Crud/button/maDeleteButton'));

    CrudModule.directive('maViewActions', require('ng-admin/Crud/misc/ViewActions'));
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

    CrudModule.config(['FieldViewConfigurationProvider', 'BooleanFieldView', 'ChoiceFieldView', 'ChoicesFieldView', 'DateFieldView', 'EmailFieldView', 'JsonFieldView', 'NumberFieldView', 'PasswordFieldView', 'ReferencedListFieldView', 'ReferenceFieldView', 'ReferenceManyFieldView', 'StringFieldView', 'TemplateFieldView', 'TextFieldView', 'WysiwygFieldView', function (fvp, BooleanFieldView, ChoiceFieldView, ChoicesFieldView, DateFieldView, EmailFieldView, JsonFieldView, NumberFieldView, PasswordFieldView, ReferencedListFieldView, ReferenceFieldView, ReferenceManyFieldView, StringFieldView, TemplateFieldView, TextFieldView, WysiwygFieldView) {
        fvp.registerFieldView('boolean', BooleanFieldView);
        fvp.registerFieldView('choice', ChoiceFieldView);
        fvp.registerFieldView('choices', ChoicesFieldView);
        fvp.registerFieldView('date', DateFieldView);
        fvp.registerFieldView('email', EmailFieldView);
        fvp.registerFieldView('file', StringFieldView); // FIXME
        fvp.registerFieldView('json', JsonFieldView);
        fvp.registerFieldView('number', NumberFieldView);
        fvp.registerFieldView('password', PasswordFieldView);
        fvp.registerFieldView('referenced_list', ReferencedListFieldView);
        fvp.registerFieldView('reference', ReferenceFieldView);
        fvp.registerFieldView('reference_many', ReferenceManyFieldView);
        fvp.registerFieldView('string', StringFieldView);
        fvp.registerFieldView('template', TemplateFieldView);
        fvp.registerFieldView('text', TextFieldView);
        fvp.registerFieldView('wysiwyg', WysiwygFieldView);
    }]);

    return CrudModule;
});
