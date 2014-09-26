define(function (require) {
    "use strict";

    var angular = require('angular'),
        ListController = require('ng-admin/Crud/component/controller/ListController'),
        FormController = require('ng-admin/Crud/component/controller/FormController'),
        DeleteController = require('ng-admin/Crud/component/controller/DeleteController'),

        InfinitePagination = require('ng-admin/Crud/component/directive/InfinitePagination'),
        Compile = require('ng-admin/Crud/component/directive/Compile'),

        StringField = require('ng-admin/Crud/component/directive/field/StringField'),
        EmailField = require('ng-admin/Crud/component/directive/field/EmailField'),
        TextField = require('ng-admin/Crud/component/directive/field/TextField'),
        NumberField = require('ng-admin/Crud/component/directive/field/NumberField'),
        DateField = require('ng-admin/Crud/component/directive/field/DateField'),
        BooleanField = require('ng-admin/Crud/component/directive/field/BooleanField'),
        ChoiceField = require('ng-admin/Crud/component/directive/field/ChoiceField'),
        ChoicesField = require('ng-admin/Crud/component/directive/field/ChoicesField'),
        ReferenceField = require('ng-admin/Crud/component/directive/field/ReferenceField'),
        WysiwygField = require('ng-admin/Crud/component/directive/field/WysiwygField'),
        ReferenceMany = require('ng-admin/Crud/component/directive/field/ReferenceMany'),
        CallbackField = require('ng-admin/Crud/component/directive/field/CallbackField'),

        CrudManager = require('ng-admin/Crud/component/service/CrudManager'),

        cacheTemplate = require('ng-admin/Crud/run/cacheTemplate'),

        routing = require('ng-admin/Crud/config/routing');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');
    require('textangular');

    var CrudModule = angular.module('crud', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular']);

    CrudModule.controller('ListController', ListController);
    CrudModule.controller('FormController', FormController);
    CrudModule.controller('DeleteController', DeleteController);

    CrudModule.service('CrudManager', CrudManager);

    CrudModule.directive('infinitePagination', InfinitePagination);
    CrudModule.directive('compile', Compile);

    CrudModule.directive('stringField', StringField);
    CrudModule.directive('emailField', EmailField);
    CrudModule.directive('textField', TextField);
    CrudModule.directive('numberField', NumberField);
    CrudModule.directive('dateField', DateField);
    CrudModule.directive('booleanField', BooleanField);
    CrudModule.directive('choiceField', ChoiceField);
    CrudModule.directive('choicesField', ChoicesField);
    CrudModule.directive('referenceField', ReferenceField);
    CrudModule.directive('wysiwygField', WysiwygField);
    CrudModule.directive('referenceManyField', ReferenceMany);
    CrudModule.directive('callbackField', CallbackField);

    /**
     * Date Picker patch
     * https://github.com/angular-ui/bootstrap/commit/42cc3f269bae020ba17b4dcceb4e5afaf671d49b
     */
    CrudModule.config(['$provide', function($provide){
        $provide.decorator('dateParser', function($delegate){

            var oldParse = $delegate.parse;
            $delegate.parse = function(input, format) {
                if ( !angular.isString(input) || !format ) {
                    return input;
                }
                return oldParse.apply(this, arguments);
            };

            return $delegate;
        });
    }]);

    CrudModule.run(cacheTemplate);

    CrudModule.config(routing);

    return CrudModule;
});
