/*global define*/

define(function () {
    'use strict';

    var angular = require('angular')

    function qDecorator($provide) {
        // taken from http://stackoverflow.com/a/18891109/1333479
        $provide.decorator('$q', ['$delegate', function ($delegate) {
            var $q = $delegate;

            $q.allEvenFailed = function (promises) {
                if (!angular.isArray(promises)) {
                    throw 'allSettled can only handle an array of promises (for now)';
                }
                var deferred = $q.defer();
                var states = [];
                var results = [];

                // First create an array for all promises with their state
                angular.forEach(promises, function (promise, key) {
                    states[key] = false;
                });

                // Loop through the promises
                // a second loop to be sure that checkStates is called when all states are set to false first
                angular.forEach(promises, function (promise, key) {
                    function resolve(result) {
                        states[key] = true;
                        results[key] = result;
                        var allFinished = true;
                        angular.forEach(states, function (state) {
                            if (!state) {
                                allFinished = false;
                            }
                        });
                        if (allFinished) {
                            deferred.resolve(results);
                        }
                    }
                    $q.when(promise).then(resolve, resolve);
                });

                return deferred.promise;
            };

            return $q;
        }]);
    }

    qDecorator.inject = ['$provide'];

    return qDecorator;
});
