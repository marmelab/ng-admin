'use strict';

angular
    .module('angularAdminApp')
    .service('panelBuilder', ['$q', 'Restangular', 'configRetriever', function($q, Restangular, configRetriever) {

        /**
         * Return the panels data
         *
         * @returns {promise}
         */
        function getPanelsData() {
            var deferred = $q.defer();

            configRetriever().then(function(data) {

                var panels = {};
                var entities = data.entities;
                Restangular.setBaseUrl(data.config.baseApiUrl);

                async.each(Object.keys(data.dashboard), function(entityName, callback) {
                    if (!(entityName in entities)) {
                        return;
                    }

                    panels[entityName] = {
                        data: {},
                        columnDefs: [],
                        label: entities[entityName].label
                    };

                    // Get grid data
                    Restangular
                        .all(entityName)
                        .getList()
                        .then(function (data) {
                            panels[entityName].data = data;

                            // Get grid columns definition
                            angular.forEach(entities[entityName].list, function(field, fieldName) {

                                if(typeof(field.panel) === 'undefined' || !field.panel) {
                                    return;
                                }

                                panels[entityName].columnDefs.push({
                                    field: fieldName,
                                    displayName: field.label
                                });
                            });

                            callback();
                        });

                }, function(err){
                    if (err) {
                        return deferred.reject(err);
                    }

                    deferred.resolve(panels)
                });
            });

            return deferred.promise;
        }

        return {
            getPanelsData: getPanelsData
        };
    }]);
