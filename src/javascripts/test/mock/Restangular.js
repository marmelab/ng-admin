/*global jasmine,define*/

define('mock/Restangular', [
    'mixins'
], function (mixins) {
    "use strict";

    var Restangular = {};

    Restangular.one = jasmine.createSpy('one').andReturn(Restangular);
    Restangular.all = jasmine.createSpy('all').andReturn(Restangular);
    Restangular.allUrl = jasmine.createSpy('allUrl').andReturn(Restangular);
    Restangular.setBaseUrl = jasmine.createSpy('setBaseUrl').andReturn(Restangular);
    Restangular.setFullResponse = jasmine.createSpy('setFullResponse').andReturn(Restangular);
    Restangular.restangularizeElement = jasmine.createSpy('restangularizeElement').andReturn(Restangular);

    Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({}));
    Restangular.put = jasmine.createSpy('post').andReturn(mixins.buildPromise({}));
    Restangular.post = jasmine.createSpy('post').andReturn(mixins.buildPromise({}));
    Restangular.customPOST = jasmine.createSpy('customPOST').andReturn(mixins.buildPromise({}));
    Restangular.remove = jasmine.createSpy('remove').andReturn(mixins.buildPromise({}));

    return Restangular;
});
