/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$q}          $q
     * @param {Restangular} Restangular
     * @param {Application} Configuration
     * @constructor
     */
    function Queries($q, Restangular, Configuration, PromisesResolver) {
        this.$q = $q;
        this.Restangular = Restangular;
        this.config = Configuration();
        this.PromisesResolver = PromisesResolver;

        this.Restangular.setFullResponse(true);  // To get also the headers
    }

    Queries.$inject = ['$q', 'Restangular', 'NgAdminConfiguration', 'PromisesResolver'];

    return Queries;
});
