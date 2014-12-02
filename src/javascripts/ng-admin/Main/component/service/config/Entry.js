/*global define*/

define(function () {
    'use strict';

    /**
     * @constructor
     */
    function Entry() {
        this.values = {};
        this.listValues = {};
        this.identifierValue = null;
        this.entityName = null;
    }

    return Entry;
});
