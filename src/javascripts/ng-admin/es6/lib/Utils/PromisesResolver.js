
class PromisesResolver {
    static allEvenFailed(promises) {
        if (!Array.isArray(promises)) {
            throw 'allEvenFailed can only handle an array of promises';
        }

        return new Promise((resolve, reject) => {
            if (promises.length === 0) {
                return resolve([]);
            }

            let states = [],
                results = [];

            promises.forEach((promise, key) => {
                states[key] = false; // promises are not resolved by default
            });

            promises.forEach((promise, key) => {
                function resolveState(result) {
                    states[key] = true;
                    results[key] = result; // result may be an error
                    for (let i in states) {
                        if (!states[i]) {
                            return;
                        }
                    }

                    resolve(results);
                }

                function resolveSuccess(result) {
                    return resolveState({status: 'success', result: result});
                }

                function resolveError(result) {
                    return resolveState({status: 'error', error: result})
                }

                // whether the promise ends with success or error, consider it done
                promise.then(resolveSuccess, resolveError);
            });
        });
    }
}

export default PromisesResolver;
