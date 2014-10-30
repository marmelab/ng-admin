/*global define*/

define(function (require) {
    'use strict';

    var referenceManyFieldView = require('text!../../../view/field/referenceMany.html');

    function ReferenceManyField() {
    }

    ReferenceManyField.prototype.contains = function (collection, item) {
        if (!collection) {
            return false;
        }

        for (var i = 0, l = collection.length; i < l; i++) {
            if (collection[i] == item) {
                return true;
            }
        }

        return false;
    };

    function ReferenceManyFieldDirective() {
        return {
            restrict: 'E',
            template: referenceManyFieldView,
            controller: ReferenceManyField,
            controllerAs: 'referenceManyField'
        };
    }

    ReferenceManyFieldDirective.$inject = [];

    return ReferenceManyFieldDirective;
});
