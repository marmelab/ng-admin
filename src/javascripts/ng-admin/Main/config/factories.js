/*global define*/

define(function () {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        ChoiceField = require('ng-admin/Main/component/service/config/fieldTypes/ChoiceField');

    function factories(nga) {

        nga.registerFieldType('boolean', Field);
        nga.registerFieldType('choice', ChoiceField);
        nga.registerFieldType('choices', ChoiceField);
        nga.registerFieldType('date', require('ng-admin/Main/component/service/config/fieldTypes/DateField'));
        nga.registerFieldType('email', Field);
        nga.registerFieldType('file', Field);
        nga.registerFieldType('json', Field);
        nga.registerFieldType('number', Field);
        nga.registerFieldType('password', Field);
        nga.registerFieldType('reference', require('ng-admin/Main/component/service/config/fieldTypes/ReferenceField'));
        nga.registerFieldType('reference_many', require('ng-admin/Main/component/service/config/fieldTypes/ReferenceManyField'));
        nga.registerFieldType('referenced_list', require('ng-admin/Main/component/service/config/fieldTypes/ReferencedListField'));
        nga.registerFieldType('string', Field);
        nga.registerFieldType('template', require('ng-admin/Main/component/service/config/fieldTypes/TemplateField'));
        nga.registerFieldType('text', Field);
        nga.registerFieldType('wysiwyg', require('ng-admin/Main/component/service/config/fieldTypes/WysiwygField'));
    }

    factories.$inject = ['NgAdminConfigurationProvider'];

    return factories;
});
