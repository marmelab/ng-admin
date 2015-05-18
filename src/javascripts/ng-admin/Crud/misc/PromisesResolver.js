/*global define*/
define(function () {
    'use strict';

    function PromisesResolver(AdminDescription) {
        return AdminDescription.getPromisesResolver();
    }

    PromisesResolver.$inject = ['AdminDescription'];

    return PromisesResolver;
});
