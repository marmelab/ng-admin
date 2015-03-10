/*global define*/
define(function () {
    'use strict';

    function PromisesResolver($q) {

        function allEvenFailed(promises) {
            if (!Array.isArray(promises)) {
                throw 'allEvenFailed can only handle an array of promises';
            }
            var deferred = $q.defer();
            if (promises.length === 0) {
                deferred.resolve([]);
                return deferred.promise;
            }

            var states = [];
            var results = [];

            promises.forEach(function (promise, key) {
                states[key] = false; // promises are not resolved by default
            });

            promises.forEach(function (promise, key) {
                function resolve(result) {
                    states[key] = true;
                    results[key] = result; // result may be an error
                    var allFinished = true;
                    states.forEach(function (state) {
                        if (!state) {
                            allFinished = false;
                        }
                    });
                    if (allFinished) {
                        deferred.resolve(results);
                    }
                }
                // whether the promise ends with success or error, consider it done
                $q.when(promise).then(resolve, resolve);
            });

            return deferred.promise;
        };

        return {
            allEvenFailed: allEvenFailed
        };
    }

    PromisesResolver.$inject = ['$q'];

    return PromisesResolver;
});
