/*global define*/

define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        utils = require('ng-admin/lib/utils');

    var config = {
        name: 'myReference',
        label: 'My references'
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
        this.value([]);

        return this;
    };

    return ReferenceMany;
});
