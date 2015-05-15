let assert = require('chai').assert,
    sinon = require('sinon');

import ReadQueries from "../../../lib/Queries/ReadQueries";
import DataStore from "../../../lib/DataStore/DataStore";
import PromisesResolver from "../../mock/PromisesResolver";
import Entity from "../../../lib/Entity/Entity";
import ReferenceField from "../../../lib/Field/ReferenceField";
import TextField from "../../../lib/Field/TextField";
import Field from "../../../lib/Field/Field";
import buildPromise from "../../mock/mixins";

describe('ReadQueries', () => {
    let readQueries,
        restWrapper = {},
        application = {},
        rawCats,
        rawHumans,
        catEntity,
        humanEntity,
        catView;

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

        readQueries = new ReadQueries(restWrapper, PromisesResolver, application);
        catEntity = new Entity('cat');
        humanEntity = new Entity('human');
        catView = catEntity.views["ListView"]
            .addField(new TextField('name'))
            .addField(new ReferenceField('human_id').targetEntity(humanEntity).targetField(new Field('firstName')));

        humanEntity.identifier(new Field('id'));

        rawCats = [
            {"id": 1, "human_id": 1, "name": "Mizoute", "summary": "A Cat"},
            {"id": 2, "human_id": 1, "name": "Suna", "summary": "A little Cat"}
        ];

        rawHumans = [
            {"id": 1, "firstName": "Daph"},
            {"id": 2, "firstName": "Manu"},
            {"id": 3, "firstName": "Daniel"}
        ];
    });

    describe("getOne", () => {

        it('should return the entity with all fields.', () => {
            let entity = new Entity('cat');
            entity.views['ListView']
                .addField(new TextField('name'));

            restWrapper.getOne = sinon.stub().returns(buildPromise({
                data: {
                    "id": 1,
                    "name": "Mizoute",
                    "summary": "A Cat"
                }
            }));

            readQueries.getOne(entity, 'list', 1)
                .then((rawEntry) => {
                    assert(restWrapper.getOne.calledWith('cat', 'http://localhost/cat/1'));

                    assert.equal(rawEntry.data.id, 1);
                    assert.equal(rawEntry.data.name, 'Mizoute');

                    // Non mapped field should also be retrieved
                    assert.equal(rawEntry.data.summary, "A Cat");
                });
        });

    });

    describe('getAll', () => {
        it('should return all data to display a ListView', () => {
            restWrapper.getList = sinon.stub().returns(buildPromise({data: rawCats, headers: () => {}}));
            PromisesResolver.allEvenFailed = sinon.stub().returns(buildPromise([
                {status: 'success', result: rawHumans[0] },
                {status: 'success', result: rawHumans[1] },
                {status: 'success', result: rawHumans[2] }
            ]));

            readQueries.getAll(catView)
                .then((result) => {
                    assert.equal(result.totalItems, 2);
                    assert.equal(result.data.length, 2);

                    assert.equal(result.data[0].id, 1);
                    assert.equal(result.data[0].name, 'Mizoute');

                    assert.equal(result.data[0].human_id, 1);
                });
        });
    });

    describe('getReferencedData', () => {
        it('should return all references data for a View with multiple calls', () => {
            let post = new Entity('posts'),
                author = new Entity('authors'),
                authorRef = new ReferenceField('author');

            let rawPosts = [
                {id: 1, author: 'abc'},
                {id: 2, author: '19DFE'}
            ];

            let rawAuthors = [
                {id: 'abc', name: 'Rollo'},
                {id: '19DFE', name: 'Ragna'}
            ];

            authorRef.targetEntity(author);
            authorRef.targetField(new Field('name'));
            post.views["ListView"]
                .addField(authorRef);

            restWrapper.getOne = sinon.stub().returns(buildPromise({}));
            PromisesResolver.allEvenFailed = sinon.stub().returns(buildPromise([
                {status: 'success', result: rawAuthors[0] },
                { status: 'success', result: rawAuthors[1] }
            ]));

            readQueries.getReferencedData(post.views["ListView"].getReferences(), rawPosts)
                .then((referencedData) => {
                    assert.equal(referencedData.author.length, 2);
                    assert.equal(referencedData.author[0].id, 'abc');
                    assert.equal(referencedData.author[1].name, 'Ragna');
                });
        });

        it('should return all references data for a View with one call', () => {
            let post = new Entity('posts'),
                author = new Entity('authors'),
                authorRef = new ReferenceField('author');

            authorRef.singleApiCall((ids) => {
                return {
                    id: ids
                };
            });

            let rawPosts = [
                {id: 1, author: 'abc'},
                {id: 2, author: '19DFE'}
            ];

            let rawAuthors = [
                {id: 'abc', name: 'Rollo'},
                {id: '19DFE', name: 'Ragna'}
            ];

            authorRef.targetEntity(author);
            authorRef.targetField(new Field('name'));
            post.views["ListView"]
                .addField(authorRef);

            restWrapper.getList = sinon.stub().returns(buildPromise({data: rawCats, headers: () => {}}));
            PromisesResolver.allEvenFailed = sinon.stub().returns(buildPromise([
                {status: 'success', result: { data: rawAuthors }}
            ]));

            readQueries.getReferencedData(post.views["ListView"].getReferences(), rawPosts)
                .then((referencedData) => {
                    assert.equal(referencedData['author'].length, 2);
                    assert.equal(referencedData['author'][0].id, 'abc');
                    assert.equal(referencedData['author'][1].name, 'Ragna');
                });
        });
    });
});
