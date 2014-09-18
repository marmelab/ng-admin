define([], function() {
    'use strict';

    /**
     * @param {$q} $q
     * @param {CrudManager} CrudManager
     * @param {Configuration} Configuration
     * @constructor
     */
    function PanelBuilder($q, CrudManager, Configuration) {
        this.$q = $q;
        this.CrudManager = CrudManager;
        this.Configuration = Configuration;
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

        angular.forEach([] /*this.Configuration.getEntityNames()*/, function(entityName) {
            entity = self.Configuration.getEntity(entityName);
            limit = entity.dashboard();

            if (limit) {
                promises.push(self.CrudManager.getAll(entityName, 1, limit));
            }
        });

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', 'CrudManager', 'Configuration'];

    return PanelBuilder;
});
