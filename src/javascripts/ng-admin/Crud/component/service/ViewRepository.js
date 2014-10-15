define(function(require) {
    'use strict';

    var angular = require('angular');

    /**
     *
     * @param {$q}          $q
     * @param {Restangular} Restangular
     * @param {Application} Configuration
     * @constructor
     */
    function ViewRepository($q, Restangular, Configuration) {
        this.$q = $q;
        this.Restangular = Restangular;
        this.config = Configuration();

        this.Restangular.setBaseUrl(this.config.baseApiUrl());
        this.Restangular.setFullResponse(true);  // To get also the headers
    }

    ViewRepository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration', 'Field'];

    return ViewRepository;
});
