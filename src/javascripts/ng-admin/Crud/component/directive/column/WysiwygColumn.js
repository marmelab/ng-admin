define(function(require) {
    'use strict';

    var angular = require('angular');
    var wysiwygColumnView = require('text!../../../view/column/wysiwyg.html');

    function WysiwygColumn() {
        return {
            restrict: 'E',
            template: wysiwygColumnView
        };
    }

    WysiwygColumn.$inject = [];

    return WysiwygColumn;
});
