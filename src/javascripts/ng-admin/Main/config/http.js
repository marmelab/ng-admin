/*global define*/

define(function () {
    'use strict';

    function http($httpProvider) {

        $httpProvider.useApplyAsync(true);
    }

    http.$inject = ['$httpProvider'];

    return http;
});
