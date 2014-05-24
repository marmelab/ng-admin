'use strict';

angular
    .module('angularAdminApp')
    .service('configRetriever', function($http, $q) {

        var config = null;

        /**
         * Return a promise with the content of the json config file
         *
         * @returns {promise}
         */
        function getConfig() {
            var deferred = $q.defer();

            if (config !== null) {
                deferred.resolve(config);
            } else {
                $http.get('/config/config.json').then(function(response) {
                    config = response.data;
                    deferred.resolve(response.data);
                });
            }

            return deferred.promise;
        }

        return {
            getConfig: getConfig
        };
    });
