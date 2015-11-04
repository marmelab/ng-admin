export default function maDateColumn() {
    return {
        restrict: 'E',
        scope: {
            value: '&',
            field: '&'
        },
        link: function(scope) {
            var field = scope.field();
            scope.format = field.format();
            if (!scope.format) {
                scope.format = field.type() === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
            }
        },
        template: '<span>{{ value() | date:format }}</span>'
    };
}

maDateColumn.$inject = [];
