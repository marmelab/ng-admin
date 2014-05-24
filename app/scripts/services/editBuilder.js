'use strict';

angular
    .module('angularAdminApp')
    .service('editBuilder', ['$q', 'Restangular', 'configRetriever', function($q, Restangular, configRetriever) {

        /**
         * Return the list data
         *
         * @returns {promise}
         */
        function getEditData(entityName, id) {
            var deferred = $q.defer();

            configRetriever.getConfig().then(function(data) {
                if (!(entityName in data.entities)) {
                    return;
                }

                var entity = data.entities[entityName];

                deferred.resolve('ok');

            });

            return deferred.promise;
        }

        return {
            getEditData: getEditData
        };
    }]);
