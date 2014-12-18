/*global define*/

define(function () {
    'use strict';

    /**
     * @constructor
     */
    function Entry(values) {
        this.values = values || {};
        this.listValues = {};
        this.identifierValue = null;
        this.entityName = null;
    }

    return Entry;
});
