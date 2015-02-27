/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany'),
        ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList');

    function factories(nga) {

        nga.registerFieldType('boolean', Field);
        nga.registerFieldType('choice', Field);
        nga.registerFieldType('choices', Field);
        nga.registerFieldType('date', Field);
        nga.registerFieldType('email', Field);
        nga.registerFieldType('file', Field);
        nga.registerFieldType('json', Field);
        nga.registerFieldType('number', Field);
        nga.registerFieldType('password', Field);
        nga.registerFieldType('reference', Reference);
        nga.registerFieldType('reference_many', ReferenceMany);
        nga.registerFieldType('referenced_list', ReferencedList);
        nga.registerFieldType('string', Field);
        nga.registerFieldType('template', Field);
        nga.registerFieldType('text', Field);
        nga.registerFieldType('wysiwyg', Field);
    }

    factories.$inject = ['NgAdminConfigurationProvider'];

    return factories;
});
