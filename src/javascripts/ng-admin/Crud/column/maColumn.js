/*global define*/

define(function (require) {
    'use strict';

    function maColumn() {
        return {
            restrict: 'E',
            template: 
'<span ng-switch="field.type()">' +
    '<ma-string-column ng-switch-when="choice"></ma-string-column>' +
    '<ma-string-column ng-switch-when="email"></ma-string-column>' +
    '<ma-string-column ng-switch-when="number"></ma-string-column>' +
    '<ma-string-column ng-switch-when="string"></ma-string-column>' +
    '<ma-string-column ng-switch-when="text"></ma-string-column>' +
    '<ma-password-column ng-switch-when="password"></ma-password-column>' +
    '<ma-date-column ng-switch-when="date"></ma-date-column>' +
    '<ma-boolean-column ng-switch-when="boolean"></ma-boolean-column>' +
    '<ma-reference-column ng-switch-when="Reference"></ma-reference-column>' +
    '<ma-reference-many-column ng-switch-when="ReferenceMany"></ma-reference-many-column>' +
    '<ma-wysiwyg-column ng-switch-when="wysiwyg"></ma-wysiwyg-column>' +
    '<ma-template-column ng-switch-when="template"></ma-template-column>' +
'</span>'
        };
    }

    maColumn.$inject = [];

    return maColumn;
});
