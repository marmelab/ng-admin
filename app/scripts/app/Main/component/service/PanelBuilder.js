define([
    'app',
    'config'
], function(app, config) {
    'use strict';

    /**
     * @param {$q} $q
     * @param {Restangular} Restangular
     * @constructor
     */
    function PanelBuilder($q, Restangular) {
        this.$q = $q;
        this.Restangular = Restangular;
    }

    PanelBuilder.prototype.getPanelsData = function() {
        var promises = [],
            self = this;

        this.Restangular.setBaseUrl(config.global.baseApiUrl);

        angular.forEach(Object.keys(config.entities) , function(entityName) {

            var deferred = self.$q.defer(),
                entity = config.entities[entityName],
                limit = entity.dashboard || 10;

            if (typeof(entity.dashboard) === 'undefined') {
                return;
            }

            // Get items
            self.Restangular
                .all(entityName)
                .getList({per_page : limit})
                .then(function (items) {

                    deferred.resolve({
                        entityName: entityName,
                        entityConfig: entity,
                        limit: limit,
                        rawItems: items
                    });
                });

            promises.push(deferred.promise);
        });

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', 'Restangular'];

    return PanelBuilder;
});
