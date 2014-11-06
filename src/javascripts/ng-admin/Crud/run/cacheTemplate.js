define(function(require) {
    "use strict";

    var editAttributeTemplate = require('text!../view/edit-attribute.html');

    /**
     * Cache all ng-admin templates
     *
     * @param {$templateCache} $templateCache
     */
    function cacheTemplate($templateCache) {
        $templateCache.put('ng-admin/Crud/view/edit-attribute.html', editAttributeTemplate);
    }

    cacheTemplate.$inject = ['$templateCache'];

    return cacheTemplate;
});
