export default function maStringColumn() {
    return {
        restrict: 'E',
        scope: {
            value: '&'
        },
        template: '<span>{{ value() }}</span>'
    };
}

maStringColumn.$inject = [];
