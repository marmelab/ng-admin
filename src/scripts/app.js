require.config({
    paths: {
        'angular': 'bower_components/angular/angular'
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
    }
});


define(function(require) {
    "use strict";

    var angular = require('angular');

    angular.module('ng-admin', [/*'main', 'crud'*/]);

    //// TMP
    //var app = angular.module('myApp', ['ng-admin']);
    //
    //app.config(function(ConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {
    //    function truncate(value) {
    //        return value.length > 50 ? value.substr(0, 50) + '...' : value;
    //    }
    //
    //    var post = Entity('posts')
    //        .label('Posts')
    //        .order(1)
    //        .dashboard(10)
    //        .perPage(10)
    //        .pagination(function(page, maxPerPage) {
    //            return {
    //                offset: (page - 1) * maxPerPage,
    //                limit: maxPerPage
    //            };
    //        })
    //        .titleCreate('Create a post')
    //        .titleEdit('Edit a post')
    //        .description('Lists all the blog posts with a simple pagination')
    //        .addField(Field('id')
    //            .label('ID')
    //            .type('number')
    //            .identifier(true)
    //            .edition('read-only')
    //        )
    //        .addField(Field('title')
    //            .label('Title')
    //            .edition('editable')
    //            .truncateList(truncate)
    //        )
    //        .addField(Field('body')
    //            .label('Body')
    //            .type('text')
    //            .edition('editable')
    //            .truncateList(truncate)
    //        );
    //
    //    var app = Application('ng-admin backend demo')
    //        .baseApiUrl('http://localhost:3000/')
    //        .addEntity(post);
    //
    //    ConfigurationProvider.configure(app);
    //});
    //
    //// we add the ng-app attribute for pure debugging purposes
    //// historically, it was needed in case angular scenario was used for e2e tests
    //document.body.setAttribute('ng-app', 'myApp');
    //
    //// async resource download implies async angular app bootstrap
    //angular.bootstrap(document.body, ['myApp']);
});
