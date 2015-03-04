require.config({
    paths: {
        'corejs': '../../../../node_modules/core-js/build/core-stable.js'
    },
    shim: {
        'corejs': {
            deps: ['corejs']
        }
    }
});

define(function (require) {
    'use strict';
    require('Application.js');
});
