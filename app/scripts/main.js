require.config({
    baseUrl: "bower_components",
    paths: {
        "jquery": "jquery/dist/jquery",
        "angular": "angular/angular",
        "angular-resource": "angular-resource/angular-resource",
        "angular-sanitize": "angular-sanitize/angular-sanitize",
        "angular-route": "angular-route/angular-route",
        "angular-ui-router": "angular-ui-router/release/angular-ui-router",
        "lodash": "lodash/dist/lodash.compat",
        "bootstrap": "bootstrap/dist/js/bootstrap",
        "restangular": "restangular/dist/restangular",
        "famous-angular": "famous-angular/dist/famous-angular",
        "humane": "humane/humane",
        "app": "/scripts/app",
        "init": "/scripts/init"
    },
    shim: {
        "bootstrap": { deps: ['jquery']},
        "angular": { exports: "angular", deps: ['jquery']},
        "angular-resource": { deps: ["angular"] },
        "angular-sanitize": { deps: ["angular"] },
        "angular-route": { deps: ["angular"] },
        "angular-ui-router": { deps: ["angular"] },
        "restangular": { deps: ["angular", "lodash"] },
        "famous-angular": { deps: ["angular"] },
        "app": { exports: "app"}
    },
    priority: [
        'angular', 'app'
    ]
});

require([
    'jquery',
    'bootstrap',
    'angular',
    'app',
    'init'
], function (jquery, bootstrap, angular, app) {});
