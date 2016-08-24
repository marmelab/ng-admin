export default {
    getReadWidget:   () => '<ma-boolean-column value="::value"></ma-boolean-column>',
    getLinkWidget:   () => '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => `<ma-choice-field field="::field" value="value" choices="::field.filterChoices()"></ma-choice-field>`,
    getWriteWidget:  () => `<div class="row">
        <ma-choice-field class="col-sm-4 col-md-3" ng-if="!field.validation().required" field="::field" value="$parent.value"></ma-choice-field>
        <ma-checkbox-field class="col-sm-4 col-md-3" ng-if="!!field.validation().required" field="::field" value="$parent.value"></ma-checkbox-field>
        <ma-help-text field="field"></ma-help-text>
    </div>`
};
