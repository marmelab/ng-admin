function maColumn($state, $compile, FieldViewConfiguration) {

    function isDetailLink(field) {
        if (field.isDetailLink() === false) {
            return false;
        }
        if (field.type() != 'reference' && field.type() != 'reference_many') {
            return true;
        }
        var relatedEntity = field.targetEntity();
        if (!relatedEntity) return false;
        return relatedEntity.isReadOnly ? relatedEntity.showView().enabled : relatedEntity.editionView().enabled;
    }

    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&',
            datastore: '&'
        },
        link: function(scope, element) {
            scope.datastore = scope.datastore();
            scope.field = scope.field();
            scope.entry = scope.entry();
            var type = scope.field.type();
            if (isDetailLink(scope.field)) {
                element.append(FieldViewConfiguration[type].getLinkWidget());
            } else {
                element.append(FieldViewConfiguration[type].getReadWidget());
            }
            $compile(element.contents())(scope);
            scope.gotoDetail = function () {
                var route = scope.field.detailLinkRoute();
                if (route == 'edit' && !scope.entity().editionView().enabled) {
                    route = 'show';
                }
                $state.go($state.get(route),
                angular.extend({
                    entity: scope.entry.entityName,
                    id: scope.entry.identifierValue
                }, $state.params));
            };
            scope.gotoReference = function () {
                var relatedEntity = scope.field.targetEntity();
                var referenceId = scope.entry.values[scope.field.name()];
                var route = relatedEntity.isReadOnly ? 'show' : scope.field.detailLinkRoute();
                $state.go($state.get(route), {
                    entity: relatedEntity.name(),
                    id: referenceId
                });
            };
        }
    };
}

maColumn.$inject = ['$state', '$compile', 'FieldViewConfiguration'];

module.exports = maColumn;
