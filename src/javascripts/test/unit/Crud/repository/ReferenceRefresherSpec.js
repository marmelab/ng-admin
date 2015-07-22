var assert = require('chai').assert;
var mixins = require('../../../mock/mixins');
var ReferenceField = require('admin-config/lib/Field/ReferenceField');
var ReadQueries = require('admin-config/lib/Queries/ReadQueries');
var ReferenceRefresher = require('../../../../ng-admin/Crud/repository/ReferenceRefresher');
var sinon = require('sinon');

describe('ReferenceRefresher', function() {
    var fakeEntity, fakeField;
    beforeEach(function() {
        fakeEntity = {
            identifier: () => {
                return {
                    name: () => 'id'
                }
            }
        };

        fakeField = {
            name: () => 'post',
            targetEntity: () => fakeEntity,
            targetField: ()  => {
                return { name: () => 'title' }
            },
            getMappedValue: v => v,
            type: () => 'reference'
        };
    });

    describe('refresh', function() {
        it('should call remote API with given search parameter', function() {
            var readQueries = new ReadQueries();
            var spy = sinon.stub(readQueries, 'getAllReferencedData', function() {
                return mixins.buildPromise({ 'post': [] });
            });

            var refresher = new ReferenceRefresher(readQueries);
            refresher.refresh(fakeField, null, 'foo');

            expect(spy.calledOnce).toBeTruthy();
            expect(spy.args[0][1]).toEqual('foo');
        });

        it('should format correctly returned results', function(done) {
            var readQueries = new ReadQueries();
            sinon.stub(readQueries, 'getAllReferencedData', function() {
                return mixins.buildPromise({
                    post: [
                        { id: 1, title: 'Discover some awesome stuff' },
                        { id: 2, title: 'Another great post'}
                    ]
                });
            });

            var refresher = new ReferenceRefresher(readQueries);
            refresher.refresh(fakeField, null, 'foo').then(function(results) {
                expect(results).toEqual([
                    { value: 1, label: 'Discover some awesome stuff' },
                    { value: 2, label: 'Another great post' }
                ]);
                done();
            });
        });

        describe('Choice deduplication (to fix some UI-Select duplicated options)', function() {
            var refresher;
            beforeEach(function() {
                var readQueries = new ReadQueries();
                sinon.stub(readQueries, 'getAllReferencedData', function() {
                    return mixins.buildPromise({
                        post: [
                            { id: 1, title: 'Discover some awesome stuff' },
                            { id: 2, title: 'Another great post'}
                        ]
                    });
                });

                refresher = new ReferenceRefresher(readQueries);
            });

            it('should remove already selected values from result list in case of multiple choices component', function(done) {
                fakeField.type = () => 'reference_many';

                refresher.refresh(fakeField, [1], 'foo').then(function(results) {
                    expect(results).toEqual([
                        { value: 2, label: 'Another great post' }
                    ]);
                    done();
                });
            });

            it('should not de-duplicate simple choice in case of single choice component', function(done) {
                fakeField.type = () => 'reference';

                refresher.refresh(fakeField, [1], 'foo').then(function(results) {
                    expect(results).toEqual([
                        { value: 1, label: 'Discover some awesome stuff' },
                        { value: 2, label: 'Another great post' }
                    ]);
                    done();
                });
            });
        });

        it('should return value transformed by `maps` field functions', function(done) {
            var readQueries = new ReadQueries();
            sinon.stub(readQueries, 'getAllReferencedData', function() {
                return mixins.buildPromise({
                    post: [
                        { id: 1, title: 'Discover some awesome stuff' },
                        { id: 2, title: 'Another great post'}
                    ]
                });
            });

            fakeField.getMappedValue = (v, e) => `${e.title} (#${e.id})`;

            var refresher = new ReferenceRefresher(readQueries);
            refresher.refresh(fakeField, null).then(function(results) {
                expect(results).toEqual([
                    { value: 1, label: 'Discover some awesome stuff (#1)' },
                    { value: 2, label: 'Another great post (#2)' }
                ]);
                done();
            });
        });
    });

    describe('getInitialChoices', function() {
        var readQueries, refresher;
        beforeEach(function() {
            readQueries = new ReadQueries();
            sinon.stub(readQueries, 'getRecordsByIds', function() {
                return mixins.buildPromise([
                    { id: 1, title: 'Discover some awesome stuff' },
                    { id: 2, title: 'Another great post'}
                ]);
            });

            refresher = new ReferenceRefresher(readQueries);
        });

        it('should retrieve correct labels from given values, in correct choices expected format', function(done) {
            refresher.getInitialChoices(fakeField, [1, 2]).then(function(results) {
                expect(readQueries.getRecordsByIds.called).toBeTruthy();
                expect(results).toEqual([
                    { value: 1, label: 'Discover some awesome stuff' },
                    { value: 2, label: 'Another great post' }
                ]);
                done();
            });
        });

        it('should return mapped values for labels', function(done) {
            fakeField.getMappedValue = (v, e) => `${e.title} (#${e.id})`;
            refresher.getInitialChoices(fakeField, [1, 2]).then(function(results) {
                expect(results).toEqual([
                    { value: 1, label: 'Discover some awesome stuff (#1)' },
                    { value: 2, label: 'Another great post (#2)' }
                ]);

                done();
            });
        });
    });
});
