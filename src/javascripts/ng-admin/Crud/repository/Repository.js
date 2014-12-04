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
    function Repository($q, Restangular, Configuration) {
        this.$q = $q;
        this.Restangular = Restangular;
        this.config = Configuration();

        this.Restangular.setBaseUrl(this.config.baseApiUrl());
        this.Restangular.setFullResponse(true);  // To get also the headers
    }

    Repository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return Repository;
});
