/*global define*/

define(function (require) {
    'use strict';

    var Reference = require('ng-admin/Main/component/service/config/Reference'),
        utils = require('ng-admin/lib/utils');

    /**
     * @constructor
     *
     * @param {String} name
     */
    function ReferenceMany(name) {
        Reference.apply(this, arguments);
        this.config.name = name || 'reference-many';
        this.config.type = 'reference_many';
    }

    utils.inherits(ReferenceMany, Reference);

    return ReferenceMany;
});
