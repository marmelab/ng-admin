'use strict';

angular
    .module('angularAdminApp')
    .service('panelBuilder', ['$q', 'Restangular', 'getConfig', function($q, Restangular, getConfig) {

        /**
         * Return the panels data
         *
         * @returns {promise}
         */
        function getPanelsData() {
            var mainDeferred = $q.defer();

            getConfig().then(function(config) {

                var promises = [];

                Restangular.setBaseUrl(config.global.baseApiUrl);

                angular.forEach(Object.keys(config.entities) , function(entityName) {

                    var deferred = $q.defer(),
                        entity = config.entities[entityName],
                        limit = entity.dashboard || 10;

                    if (typeof(entity.dashboard) === 'undefined') {
                        return;
                    }

                    // Get items
                    Restangular
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
                })

                return $q.all(promises);
            })
            .then(mainDeferred.resolve, mainDeferred.reject);

            return mainDeferred.promise;
        }

        return {
            getPanelsData: getPanelsData
        };
    }]);
