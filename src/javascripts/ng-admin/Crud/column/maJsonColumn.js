/*global define*/

define(function (require) {
    'use strict';

    function maJsonColumn($compile) {
        return {
            restrict: 'E',
            scope: {
                value: '&'
            },
            link: function(scope, element) {
                scope.guessType = function(obj) {
                    var type = Object.prototype.toString.call(obj);

                    if (type === "[object Object]") {
                        return "Object";
                    }

                    if (type === "[object Array]") {
                        return "Array";
                    }

                    return "Literal";
                };

                var template =  '<span ng-switch="guessType(value())">' +
                                    '<table class="table table-condensed" ng-switch-when="Array">' + 
                                        '<tbody>' +
                                            '<tr ng-repeat="val in value() track by $index">' +
                                                '<td ng-switch="guessType(val)">' +
                                                    '<ma-json-column ng-switch-when="Object" value="::val"></ma-json-column>' +
                                                    '<ma-json-column ng-switch-when="Array" value="::val"></ma-json-column>' +
                                                    '<span ng-switch-when="Literal">{{ val }}</span>' +
                                                '</td>' +
                                            '</tr>' +
                                        '</tbody>' +
                                    '</table>' +
                                    '<table class="table table-condensed table-bordered" ng-switch-when="Object">' +
                                        '<tbody>' +
                                            '<tr ng-repeat="(key, val) in value() track by key">' +
                                                '<th class="active">{{ key }}</th>' +
                                                '<td ng-switch="guessType(val)">' +
                                                    '<ma-json-column ng-switch-when="Object" value="::val"></ma-json-column>' +
                                                    '<ma-json-column ng-switch-when="Array" value="::val"></ma-json-column>' +
                                                    '<span ng-switch-when="Literal">{{ val }}</span>' +
                                                '</td>' +
                                            '</tr>' +
                                        '</tbody>' +
                                    '</table>' +
                                '</span>';

                var newElement = angular.element(template);
                $compile(newElement)(scope);
                element.replaceWith(newElement);
            }
        };
    }

    maJsonColumn.$inject = ['$compile'];

    return maJsonColumn;
});
