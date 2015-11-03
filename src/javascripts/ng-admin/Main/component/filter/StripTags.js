export default function stripTags() {
    return function (input) {
        return input.replace(/(<([^>]+)>)/ig, '');
    };
}

stripTags.$inject = [];
