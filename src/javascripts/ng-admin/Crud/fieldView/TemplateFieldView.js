export default {
    getReadWidget:   () => '<ma-template-column entry="::entry" field="::field" entity="::entity"></ma-template-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-template-field field="::field" value="value" values="values" filters="filters"></ma-template-field>',
    getWriteWidget:  () => '<ma-template-field field="::field" value="value" entry="entry" entity="::entity"></ma-template-field>'
};
