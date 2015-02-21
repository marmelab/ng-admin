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
    function Queries($q, Restangular, Configuration) {
        this.$q = $q;
        this.Restangular = Restangular;
        this.config = Configuration();
    }

    Queries.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return Queries;
});
