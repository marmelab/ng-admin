export default function maNumberColumn() {
    return {
        restrict: 'E',
        scope: {
            value: '&',
            field: '&'
        },
        template: '<span>{{ value() | numeraljs:field().format() }}</span>'
    };
}

maNumberColumn.$inject = [];
