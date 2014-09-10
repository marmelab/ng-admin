require.config({
    paths: {
        'jquery': 'bower_components/jquery/dist/jquery',
        'angular': 'bower_components/angular/angular',
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'angular-route': 'bower_components/angular-route/angular-route',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'lodash': 'bower_components/lodash/dist/lodash.min',
        'text' : 'bower_components/requirejs-text/text',
        'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
        'angular-bootstrap-tpls': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'restangular': 'bower_components/restangular/dist/restangular',
        'humane': 'bower_components/humane/humane'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'restangular': {
            deps: ['angular', 'lodash']
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps: ['angular']
        },
        'angular-bootstrap-tpls': {
            deps: ['angular', 'angular-bootstrap']
        },
        'jquery': {
            exports: '$'
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'angular-route': {
            deps: ['angular']
        }
    },
    modules: [
        {
            name: 'common',
            include: [
                'lodash',
                'angular',
                'restangular',
                'angular-ui-router',
                'angular-bootstrap-tpls'
            ],
            override: {
                generateSourceMaps: false,
                optimize: 'none'
            }
        }
    ]
});
