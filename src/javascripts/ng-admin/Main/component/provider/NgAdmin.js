/*global define*/

define(function () {
    'use strict';

    function NgAdmin() {
        this.config = null;
    }

    NgAdmin.prototype.configure = function (config) {
        this.config = config;
    };

    NgAdmin.prototype.$get = function () {
        var config = this.config;
        return function () {
            return config;
        };
    };

    NgAdmin.$inject = [];

    return NgAdmin;
});
