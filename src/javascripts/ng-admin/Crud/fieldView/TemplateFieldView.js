module.exports = {
    getReadWidget:   () => '<ma-template-column entry="::entry" field="::field" entity="::entity"></ma-template-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-template-field field="::field" value="values[field.name()]" values="values" filters="filters"></ma-template-field>',
    getWriteWidget:  () => '<ma-template-field entry="entry" field="::field" entity="::entity"></ma-template-field>'
};
