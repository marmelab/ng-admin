module.exports = {
    getReadWidget:   () => '<ma-boolean-column value="::entry.values[field.name()]"></ma-boolean-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>', 
    getFilterWidget: () => `<ma-choice-field field="::field" value="values[field.name()]" choices="[{value: 'true', label: 'true' }, { value: 'false', label: 'false' }]"></ma-choice-field>`,
    getWriteWidget:  () => `<div class="row"><ma-choice-field class="col-sm-4 col-md-3" field="::field" value="entry.values[field.name()]"></ma-choice-field></div>`
}
