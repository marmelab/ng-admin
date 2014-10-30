/*global define*/

define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        utils = require('ng-admin/lib/utils');

    function defaultValueTransformer(value) {
        if (typeof (value) === 'undefined') {
            return [];
        }

        return (typeof value === 'object' && typeof value.length === 'number') ? value : [value];
    }

    var config = {
        name: 'myReference',
        label: 'My references',
        edition : 'editable',
        order: null,
        targetEntity : null,
        targetField : null,
        valueTransformer : defaultValueTransformer,
        list: true,
        dashboard: true,
        identifier: false,
        isEditLink: true,
        validation: {
            required: false
        },
        defaultValue: null
    };

    /**
     * @constructor
     *
     * @param {String} name
     */
    function ReferenceMany(name) {
        Reference.apply(this, arguments);

        this.config.name = name || 'reference-many';
        this.config.type = 'reference-many';
    }

    utils.inherits(ReferenceMany, Reference);
    Configurable(ReferenceMany.prototype, config);

    ReferenceMany.prototype.clear = function () {
        this.value = [];

        return this;
    };

    ReferenceMany.prototype.processDefaultValue = function() {
        if (!this.value && this.defaultValue()) {
            this.value = this.defaultValue();
        }
    };

    Configurable(ReferenceMany.prototype, config);

    return ReferenceMany;
});
