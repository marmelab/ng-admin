
class Queries {
    constructor(RestWrapper, PromisesResolver, Application) {
        this._restWrapper = RestWrapper;
        this._promisesResolver = PromisesResolver;
        this._application = Application;
    }
}

export default Queries;
