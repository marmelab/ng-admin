/*global define*/

define(function () {
    'use strict';

    function stripTags() {
        return function (input) {
            return input.replace(/(<([^>]+)>)/ig, '');
        };
    }

    stripTags.$inject = [];

    return stripTags;
});
