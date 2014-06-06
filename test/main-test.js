(function() {
    'use strict';

    var dependencies = ['jquery', 'angular'];
    for (var file in window.__karma__.files) {
        if (window.__karma__.files.hasOwnProperty(file)) {
            if (/^\/base\/test\/(.*)spec\.js$/i.test(file)) {
                dependencies.push(file);
            }
        }
    }

    var vendor = function(relPath, uncompressed) {
        return '/base/app/bower_components/' + relPath + (!uncompressed ? '.min' : '');
    };

    requirejs.config({
        baseUrl: '/base/app/bower_component',

        paths: {
            jquery: vendor('jquery/dist/jquery', true),
            lodash: vendor('lodash/dist/lodash', true),
            angular: vendor('angular/angular', true),
            angularUI: vendor('angular-ui/build/angular-ui', true)
        },

        shim: {
            angularAnimate: ['angular'],
            angularUI: ['angular'],
            'lodash': {
                exports: '_'
            }
        },


        priority: [
            'angular'
        ],

        // ask Require.js to load these files (all our tests)
        deps: dependencies,

        // start test run, once Require.js is done
        callback: window.__karma__.start
    });


})();
