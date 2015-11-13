function getDetailLinkRouteName(field, entity) {
    if (entity.isReadOnly) {
        return entity.showView().enabled ? 'show' : false;
    }
    if (field.detailLinkRoute() == 'edit' && entity.editionView().enabled) {
        return 'edit';
    }
    return entity.showView().enabled ? 'show' : false;
}

export default function maReferenceLinkColumn(NgAdminConfiguration) {
    return {
        restrict: 'E',
        scope: {
            entry: '&',
            field: '&',
            value: '&',
            datastore: '&'
        },
        link: {
            pre: function(scope) {
                const field = scope.field();
                var referenceEntity = field.targetEntity().name();
                var relatedEntity = NgAdminConfiguration().getEntity(referenceEntity);
                var referenceId = scope.entry().values[field.name()];
                scope.route = getDetailLinkRouteName(field, relatedEntity);
                scope.stateParams = {
                    entity: referenceEntity,
                    id: referenceId
                };
                scope.field = field;
            }
        },
        template: '<a ui-sref="{{route}}(stateParams)"><ma-reference-column field="::field" value="::value()" datastore="::datastore()"></ma-reference-column></a>'
    };
}

maReferenceLinkColumn.$inject = ['NgAdminConfiguration'];
