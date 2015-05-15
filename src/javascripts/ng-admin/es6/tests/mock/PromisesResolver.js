
import buildPromise from "./mixins";

var PromisesResolver = {
    allEvenFailed: function() { return buildPromise([]); }
};

export default PromisesResolver;
