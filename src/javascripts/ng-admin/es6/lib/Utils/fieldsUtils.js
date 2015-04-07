export default {
    /**
     * Convert fieldsLiteral as returned by fields methods to an array of field sorted by their order
     */
    fieldsLiteralToArray: function (fieldsLiteral) {
        var array = Object.keys(fieldsLiteral).map(function (key) {
            return fieldsLiteral[key];
        })
        .sort(function (a, b) {
            return a.order() - b.order();
        });

        return array;
    }
};
