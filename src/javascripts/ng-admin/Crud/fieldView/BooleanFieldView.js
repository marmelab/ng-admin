module.exports = {
    getReadWidget:   () => '<ma-boolean-column value="::field.getLabelForChoice(entry.values[field.name()], entry)"></ma-boolean-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => `<ma-choice-field field="::field" value="values[field.name()]" choices="[{value: 'true', label: 'true' }, { value: 'false', label: 'false' }]"></ma-choice-field>`,
    getWriteWidget:  () => {
        return `<div class="row">
            <ma-choice-field class="col-sm-4 col-md-3" ng-if="!field.validation().required" field="::field" value="entry.values[field.name()]"></ma-choice-field>
            <ma-checkbox-field class="col-sm-4 col-md-3" ng-if="!!field.validation().required" field="::field" value="entry.values[field.name()]"></ma-checkbox-field>
        </div>`;
    }
}
