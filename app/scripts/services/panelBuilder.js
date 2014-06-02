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
            var deferred = $q.defer();

            getConfig().then(function(config) {

                var panels = {};
                var entities = config.entities;
                Restangular.setBaseUrl(config.global.baseApiUrl);

                async.each(Object.keys(config.entities), function(entityName, callback) {

                    var entity = config.entities[entityName];

                    if (typeof(entity.dashboard) === 'undefined') {
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
                            angular.forEach(entities[entityName].fields, function(field, fieldName) {

                                if(typeof(field.dashboard) === 'undefined' || field.dashboard !== true) {
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
