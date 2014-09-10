define([], function() {
    'use strict';

    function Spinner() {
        this.element = angular.element(document.getElementById('loader'));
    }

    Spinner.prototype.start = function() {
        this.element.addClass('loading');
    };

    Spinner.prototype.stop = function() {
        this.element.removeClass('loading');
    };

    return Spinner;
});
