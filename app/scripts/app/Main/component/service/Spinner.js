define([], function() {
    'use strict';

    function Spinner() {
    }

    Spinner.prototype.start = function() {
        angular.element(document.getElementById('loader')).addClass('loading');
    };

    Spinner.prototype.stop = function() {
        angular.element(document.getElementById('loader')).removeClass('loading');
    };

    return Spinner;
});
