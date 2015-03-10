const flatten = (arr) => {
    if (!arr) {
        return null;
    }

    var [car, ...cdr] = arr;
    if (car === undefined) {
        return [];
    }

    if (Array.isArray(car)) {
        return [...flatten(car), ...flatten(cdr)];
    }

    return [car, ...flatten(cdr)];
};

export default {
    flatten: flatten
};
