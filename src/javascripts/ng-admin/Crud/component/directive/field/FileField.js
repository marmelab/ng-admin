define(function(require) {
    'use strict';

    var angular   = require('angular'),
        fileFieldView = require('text!../../../view/field/file.html');

    function FileField() {
        return {
            restrict: 'E',
            template: fileFieldView
        };
    }

    FileField.$inject = [];

    return FileField;
});
