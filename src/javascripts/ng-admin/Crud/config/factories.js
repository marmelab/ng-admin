/*global define*/

define(function (require) {
    'use strict';

    function factories(fvp) {
        fvp.registerFieldView('boolean', require('ng-admin/Crud/fieldView/BooleanFieldView'));
        fvp.registerFieldView('choice', require('ng-admin/Crud/fieldView/ChoiceFieldView'));
        fvp.registerFieldView('choices', require('ng-admin/Crud/fieldView/ChoicesFieldView'));
        fvp.registerFieldView('date', require('ng-admin/Crud/fieldView/DateFieldView'));
        fvp.registerFieldView('datetime', require('ng-admin/Crud/fieldView/DateFieldView'));
        fvp.registerFieldView('email', require('ng-admin/Crud/fieldView/EmailFieldView'));
        fvp.registerFieldView('file', require('ng-admin/Crud/fieldView/FileFieldView'));
        fvp.registerFieldView('json', require('ng-admin/Crud/fieldView/JsonFieldView'));
        fvp.registerFieldView('number', require('ng-admin/Crud/fieldView/NumberFieldView'));
        fvp.registerFieldView('password', require('ng-admin/Crud/fieldView/PasswordFieldView'));
        fvp.registerFieldView('referenced_list', require('ng-admin/Crud/fieldView/ReferencedListFieldView'));
        fvp.registerFieldView('reference', require('ng-admin/Crud/fieldView/ReferenceFieldView'));
        fvp.registerFieldView('reference_many', require('ng-admin/Crud/fieldView/ReferenceManyFieldView'));
        fvp.registerFieldView('string', require('ng-admin/Crud/fieldView/StringFieldView'));
        fvp.registerFieldView('template', require('ng-admin/Crud/fieldView/TemplateFieldView'));
        fvp.registerFieldView('text', require('ng-admin/Crud/fieldView/TextFieldView'));
        fvp.registerFieldView('wysiwyg', require('ng-admin/Crud/fieldView/WysiwygFieldView'));
    }

    factories.$inject = ['FieldViewConfigurationProvider'];

    return factories;
});
