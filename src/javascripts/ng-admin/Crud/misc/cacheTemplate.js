/*global define*/

define(function (require) {
    'use strict';

    var editAttributeTemplate = require('text!../form/edit-attribute.html');

    /**
     * Cache all ng-admin templates
     *
     * @param {$templateCache} $templateCache
     */
    function cacheTemplate($templateCache) {
        $templateCache.put('ng-admin/Crud/form/edit-attribute.html', editAttributeTemplate);
    }

    cacheTemplate.$inject = ['$templateCache'];

    return cacheTemplate;
});
