var assert = require('chai').assert;
var expect = require('chai').expect;

import PromisesResolver from "../../../lib/Utils/PromisesResolver";

describe('PromisesResolver', () => {

    describe("allEvenFailed()", () => {

        it('should throw an exception when the argument is not an array', () => {
            var error = 'allEvenFailed can only handle an array of promises';

            expect(() => { PromisesResolver.allEvenFailed('nope') }).to.throw(error);
            expect(() => { PromisesResolver.allEvenFailed() }).to.throw(error);
            expect(() => { PromisesResolver.allEvenFailed(1) }).to.throw(error);
        });

        it('should resolve all promises', (done) => {
            let p1Result = false,
                p2Result = false,
                p1 = new Promise((resolve, reject) => {
                    resolve('p1');
                }),
                p2 = new Promise((resolve, reject) => {
                    resolve('p2');
                });

            p1.then((result) => {
                p1Result = result;
            });
            p2.then((result) => {
                p2Result = result;
            });

            let result = PromisesResolver.allEvenFailed([p1, p2]);

            // Check that all promises were resolved
            result.then(() => {
                assert.equal(p1Result, 'p1');
                assert.equal(p1Result, 'p2');

                // assert.equal does not throw an error when failing,
                // so we use a callback that timeout in case of error
                done();
            });
        });
    });
});
