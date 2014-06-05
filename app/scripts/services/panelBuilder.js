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

                var promises = [],
                    entities = config.entities;

                Restangular.setBaseUrl(config.global.baseApiUrl);

                angular.forEach(Object.keys(config.entities) , function(entityName) {

                    var deferred = $q.defer(),
                        entity = config.entities[entityName];

                    if (typeof(entity.dashboard) === 'undefined') {
                        return;
                    }

                    var panel = {
                            name: entityName,
                            data: {},
                            columnDefs: [],
                            label: entities[entityName].label
                            },
                        limit = entity.dashboard || 10;

                    // Get grid data
                    Restangular
                        .all(entityName)
                        .getList({per_page : limit})
                        .then(function (data) {
                            panel.data = data;

                            // Get grid columns definition
                            angular.forEach(entities[entityName].fields, function(field, fieldName) {

                                if(typeof(field.dashboard) === 'undefined' || field.dashboard !== true) {
                                    return;
                                }

                                panel.columnDefs.push({
                                    field: fieldName,
                                    displayName: field.label
                                });

                            },deferred.reject);

                            deferred.resolve(panel);
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
