/*global define*/

define(function (require) {
    'use strict';

    var ReferenceField = require('ng-admin/Main/component/service/config/fieldTypes/ReferenceField'),
        utils = require('ng-admin/lib/utils');

    /**
     * @constructor
     *
     * @param {String} name
     */
    function ReferenceManyField(name) {
        ReferenceField.apply(this, arguments);
        this.config.name = name || 'reference-many';
        this.config.type = 'reference_many';
    }

    utils.inherits(ReferenceManyField, ReferenceField);

    return ReferenceManyField;
});
