function buildPromise(output) {
    return (function() {
        var result;
        return {
            'then': (cb) => {
                result = cb(output);

                if (result && result.then) {
                    // The result is already a promise, just return it
                    return result;
                }

                // We chain the result into a new promise
                return buildPromise(result);
            },
            'finally': (cb) => {
                cb();
                return this;
            }
        };
    }());
}

export default buildPromise;
