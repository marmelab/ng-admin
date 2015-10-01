module.exports = {
    getReadWidget:   () => '<ma-boolean-column value="::value"></ma-boolean-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => `<ma-choice-field field="::field" value="value" choices="[{value: 'true', label: 'true' }, { value: 'false', label: 'false' }]"></ma-choice-field>`,
    getWriteWidget:  () => `<div class="row">
        <ma-choice-field class="col-sm-4 col-md-3" ng-if="!field.validation().required" field="::field" value="value"></ma-choice-field>
        <ma-checkbox-field class="col-sm-4 col-md-3" ng-if="!!field.validation().required" field="::field" value="value"></ma-checkbox-field>
    </div>`
}
