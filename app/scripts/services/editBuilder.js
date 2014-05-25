'use strict';

angular
    .module('angularAdminApp')
    .service('editBuilder', ['$q', 'Restangular', 'configRetriever', function($q, Restangular, configRetriever) {

        /**
         * Return the edition data
         *
         * @returns {promise}
         */
        function getEditData(entityName, entityId) {
            var deferred = $q.defer();

            configRetriever.getConfig().then(function(data) {
                if (!(entityName in data.entities)) {
                    return;
                }

                var entityConfig = data.entities[entityName],
                    fields = entityConfig.edit;
                Restangular.setBaseUrl(data.config.baseApiUrl);

                // Get element data
                Restangular.one(entityName, entityId).get().then(function (entity) {

                    angular.forEach(entityConfig.edit, function(field, fieldName) {
                        if (typeof(entity[fieldName]) !== "undefined") {
                            fields[fieldName].value = entity[fieldName];
                        }
                    });

                    deferred.resolve({
                        fields: fields,
                        entityLabel: entityConfig.label
                    });
                });

            });

            return deferred.promise;
        }

        return {
            getEditData: getEditData
        };
    }]);
