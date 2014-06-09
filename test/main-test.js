(function() {
    'use strict';

    var dependencies = ['jquery', 'angular', 'app', 'init'];
    for (var file in window.__karma__.files) {
        if (window.__karma__.files.hasOwnProperty(file)) {
            if (/(.*)spec\.js$/i.test(file)) {
                dependencies.push(file);
            }
        }
    }

    var vendor = function(relPath, uncompressed) {
        if (typeof(uncompressed) === 'undefined') {
            uncompressed = true;
        }

        return 'app/bower_components/' + relPath + (!uncompressed ? '.min' : '');
    };

    requirejs({
        baseUrl: '/base/bower_components',

        paths: {
            "jquery": 'jquery/dist/jquery',
            "angular": ('angular/angular'),
            "angular-ui": ('angular-ui/build/angular-ui'),
            "angular-resource": ('angular-resource/angular-resource'),
            "angular-sanitize": ('angular-sanitize/angular-sanitize'),
            "angular-route": ('angular-route/angular-route'),
            "angular-ui-router": ('angular-ui-router/release/angular-ui-router'),
            "angular-mocks": ('angular-mocks/angular-mocks'),
            "lodash": ('lodash/dist/lodash'),
            "bootstrap": ('bootstrap/dist/js/bootstrap'),
            "restangular": ('restangular/dist/restangular'),
            "famous-angular": ('famous-angular/dist/famous-angular'),
            "famous": ('famous'),
            "humane": ('humane/humane'),
            "app": ('../scripts/app'),
            "init": ('../scripts/init')
        },

        shim: {
            "bootstrap": { deps: ['jquery']},
            "angular": { exports: "angular", deps: ['jquery']},
            "angular-resource": { deps: ["angular"] },
            "angular-sanitize": { deps: ["angular"] },
            "angular-route": { deps: ["angular"] },
            "angular-ui-router": { deps: ["angular"] },
            "angular-mocks": { deps: ["angular"] },
            "lodash": { exports: "_" },
            "restangular": { deps: ["angular", "lodash"] },
            "famous-angular": { deps: ["angular"] }
        },

        priority: ['angular', 'app']

    }, dependencies, function () {
        window.addEventListener('$famousModulesLoaded', function() {
            __karma__.start();
        });
    });
})();
