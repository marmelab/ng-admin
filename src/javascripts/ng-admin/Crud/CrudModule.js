/*global define*/
var inflection; // FIXME
define(function (require) {
    'use strict';

    var angular = require('angular');
    inflection = require('inflection');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');
    require('textangular');
    require('ngInflection');

    var CrudModule = angular.module('crud', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular', 'ngInflection']);

    CrudModule.controller('ListController', require('ng-admin/Crud/list/ListController'));
    CrudModule.controller('ShowController', require('ng-admin/Crud/show/ShowController'));
    CrudModule.controller('FormController', require('ng-admin/Crud/form/FormController'));
    CrudModule.controller('DeleteController', require('ng-admin/Crud/delete/DeleteController'));

    CrudModule.service('RetrieveQueries', require('ng-admin/Crud/repository/RetrieveQueries'));
    CrudModule.service('CreateQueries', require('ng-admin/Crud/repository/CreateQueries'));
    CrudModule.service('UpdateQueries', require('ng-admin/Crud/repository/UpdateQueries'));
    CrudModule.service('DeleteQueries', require('ng-admin/Crud/repository/DeleteQueries'));

    CrudModule.directive('maChoiceField', require('ng-admin/Crud/field/maChoiceField'));
    CrudModule.directive('maChoicesField', require('ng-admin/Crud/field/maChoicesField'));
    CrudModule.directive('maDateField', require('ng-admin/Crud/field/maDateField'));
    CrudModule.directive('maInputField', require('ng-admin/Crud/field/maInputField'));
    CrudModule.directive('maCheckboxField', require('ng-admin/Crud/field/maCheckboxField'));
    CrudModule.directive('maTextField', require('ng-admin/Crud/field/maTextField'));
    CrudModule.directive('maWysiwygField', require('ng-admin/Crud/field/maWysiwygField'));
    CrudModule.directive('templateField', require('ng-admin/Crud/field/TemplateField'));

    CrudModule.directive('listActions', require('ng-admin/Crud/list/ListActions'));
    CrudModule.directive('maDatagrid', require('ng-admin/Crud/list/maDatagrid'));
    CrudModule.directive('datagridPagination', require('ng-admin/Crud/list/DatagridPagination'));
    CrudModule.directive('maQuickFilter', require('ng-admin/Crud/filter/maQuickFilter'));
    CrudModule.directive('maFilterView', require('ng-admin/Crud/filter/maFilterView'));

    CrudModule.directive('maColumn', require('ng-admin/Crud/column/maColumn'));
    CrudModule.directive('maBooleanColumn', require('ng-admin/Crud/column/maBooleanColumn'));
    CrudModule.directive('maChoicesColumn', require('ng-admin/Crud/column/maChoicesColumn'));
    CrudModule.directive('maDateColumn', require('ng-admin/Crud/column/maDateColumn'));
    CrudModule.directive('maPasswordColumn', require('ng-admin/Crud/column/maPasswordColumn'));
    CrudModule.directive('maReferencedListColumn', require('ng-admin/Crud/column/maReferencedListColumn'));
    CrudModule.directive('maReferenceManyColumn', require('ng-admin/Crud/column/maReferenceManyColumn'));
    CrudModule.directive('maReferenceManyLinkColumn', require('ng-admin/Crud/column/maReferenceManyLinkColumn'));
    CrudModule.directive('maStringColumn', require('ng-admin/Crud/column/maStringColumn'));
    CrudModule.directive('maTemplateColumn', require('ng-admin/Crud/column/maTemplateColumn'));
    CrudModule.directive('maWysiwygColumn', require('ng-admin/Crud/column/maWysiwygColumn'));

    CrudModule.directive('maBackButton', require('ng-admin/Crud/button/maBackButton'));
    CrudModule.directive('maCreateButton', require('ng-admin/Crud/button/maCreateButton'));
    CrudModule.directive('maEditButton', require('ng-admin/Crud/button/maEditButton'));
    CrudModule.directive('maShowButton', require('ng-admin/Crud/button/maShowButton'));
    CrudModule.directive('maListButton', require('ng-admin/Crud/button/maListButton'));
    CrudModule.directive('maDeleteButton', require('ng-admin/Crud/button/maDeleteButton'));

    CrudModule.directive('maViewActions', require('ng-admin/Crud/misc/ViewActions'));
    CrudModule.directive('compile', require('ng-admin/Crud/misc/Compile'));
    CrudModule.run(require('ng-admin/Crud/misc/cacheTemplate'));

    CrudModule.config(require('ng-admin/Crud/routing'));

    CrudModule.factory('notification', function () {
        return require('humane');
    });

    CrudModule.factory('progression', function () {
        return require('nprogress');
    });


    /**
     * Date Picker patch
     * https://github.com/angular-ui/bootstrap/commit/42cc3f269bae020ba17b4dcceb4e5afaf671d49b
     */
    CrudModule.config(['$provide', function ($provide) {
        $provide.decorator('dateParser', function ($delegate) {

            var oldParse = $delegate.parse;
            $delegate.parse = function (input, format) {
                if (!angular.isString(input) || !format) {
                    return input;
                }

                return oldParse.apply(this, arguments);
            };

            return $delegate;
        });
    }]);

    return CrudModule;
});
