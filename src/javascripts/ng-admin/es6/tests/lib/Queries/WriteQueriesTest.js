var assert = require('chai').assert;
var sinon = require('sinon');

import WriteQueries from "../../../lib/Queries/WriteQueries";
import DataStore from "../../../lib/DataStore/DataStore";
import PromisesResolver from "../../mock/PromisesResolver";
import Entity from "../../../lib/Entity/Entity";
import TextField from "../../../lib/Field/TextField";
import buildPromise from "../../mock/mixins";

describe('WriteQueries', () => {
    var writeQueries,
        restWrapper = {},
        application = {},
        entity,
        view;

    beforeEach(() => {
        application = {
            getRouteFor: (entity, generatedUrl, viewType, id) => {
                let url = 'http://localhost/' + entity.name();
                if (id) {
                    url += '/' + id;
                }

                return url;
            }
        };

        writeQueries = new WriteQueries(restWrapper, PromisesResolver, application);
        entity = new Entity('cat');
        view = entity.views["CreateView"]
            .addField(new TextField('name'));
    });

    describe('createOne', () => {
        it('should POST an entity when calling createOne', () => {
            var rawEntity = {name: 'Mizu'};

            restWrapper.createOne = sinon.stub().returns(buildPromise({data: rawEntity}));

            writeQueries.createOne(view, rawEntity)
                .then((rawEntry) => {
                    assert(restWrapper.createOne.calledWith(rawEntity, 'cat', 'http://localhost/cat'));

                    var dataStore = new DataStore();
                    var entry = dataStore.mapEntry(entity.name(), view.identifier(), view.getFields(), rawEntry);
                    assert.equal(entry.values.data.name, 'Mizu');
                });
        });
    });

    describe('updateOne', () => {
        var rawEntity = {id: 3, name: 'Mizu'},
            updatedEntity = {id: 3, name: 'Mizute'};

        restWrapper.updateOne = sinon.stub().returns(buildPromise({data: updatedEntity}));

        it('should PUT an entity when calling updateOne', () => {
            writeQueries.updateOne(view, rawEntity)
                .then((rawEntry) => {
                    assert(restWrapper.updateOne.calledWith(rawEntity, 'cat', 'http://localhost/cat/3'));

                    var dataStore = new DataStore();
                    var entry = dataStore.mapEntry(entity.name(), view.identifier(), view.getFields(), rawEntry);
                    assert.equal(entry.values.data.name, 'Mizute');
                });
        });

        it('should PUT an entity when calling updateOne with an id', () => {
            writeQueries.updateOne(view, rawEntity, 3)
                .then((rawEntry) => {
                    assert(restWrapper.updateOne.calledWith(rawEntity, 'cat', 'http://localhost/cat/3'));

                    var dataStore = new DataStore();
                    var entry = dataStore.mapEntry(entity.name(), view.identifier(), view.getFields(), rawEntry);
                    assert.equal(entry.values.data.name, 'Mizute');
                });
        });
    });

    describe("deleteOne", () => {
        restWrapper.deleteOne = sinon.stub().returns(buildPromise({}));

        it('should DELETE an entity when calling deleteOne', () => {
            writeQueries.deleteOne(view, 1)
                .then(() => {
                    assert(restWrapper.deleteOne.calledWith('cat', 'http://localhost/cat/1'));
                });
        });
    });

    describe("batchDelete", () => {
        it('should DELETE entities when calling batchEntities', () => {
            restWrapper.deleteOne = sinon.stub().returns(buildPromise({}));

            writeQueries.batchDelete(view, [1, 2])
                .then(() => {
                    assert(restWrapper.deleteOne.calledTwice);
                    assert(restWrapper.deleteOne.calledWith('cat', 'http://localhost/cat/1'));
                    assert(restWrapper.deleteOne.calledWith('cat', 'http://localhost/cat/2'));
                });
        });
    });
});
