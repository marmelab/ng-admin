/**
 * Simple Javascript inheritance helper
 * @param {Object} child
 * @param {Object} parent
 */
export function inherits(child, parent) {
    var Wrapper = new Function();
    Wrapper.prototype = parent.prototype;

    child.prototype = new Wrapper();
    child.prototype.constructor = child;
}

/**
 * camelCase a string
 *
 * @see http://stackoverflow.com/questions/10425287/convert-string-to-camelcase-with-regular-expression
 * @see http://phpjs.org/functions/ucfirst/
 *
 * @param {String} input
 * @returns {string}
 */
export function camelCase(input) {
    var f = input.charAt(0).toUpperCase();

    input = f + input.substr(1);

    return input.replace(/[-_](.)/g, function (match, group1) {
        return ' ' + group1.toUpperCase();
    });
}
