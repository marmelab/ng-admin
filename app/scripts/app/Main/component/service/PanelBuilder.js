define([
    'config'
], function(config) {
    'use strict';

    /**
     * @param {$q} $q
     * @param {CrudManager} CrudManager
     * @constructor
     */
    function PanelBuilder($q, CrudManager) {
        this.$q = $q;
        this.CrudManager = CrudManager;
    }

    /**
     * Returns all elements of each dashboard panels
     *
     * @returns {Promise}
     */
    PanelBuilder.prototype.getPanelsData = function() {
        var promises = [],
            entity,
            limit,
            self = this;

        angular.forEach(config.getEntityNames(), function(entityName) {
            entity = config.getEntity(entityName);
            limit = entity.dashboard();

            if (limit) {
                promises.push(self.CrudManager.getAll(entityName, 1, limit));
            }
        });

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', 'CrudManager'];

    return PanelBuilder;
});
