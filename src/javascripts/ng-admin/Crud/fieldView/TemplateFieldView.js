define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-template-column entry="::entry" field="::field" entity="::entity"></ma-template-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getFilterWidget() {
        return '<ma-template-field field="::field" value="values[field.name()]" values="values" filters="filters"></ma-template-field>';
    }
    function getWriteWidget() {
        return '<ma-template-field entry="entry" field="::field" entity="::entity"></ma-template-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
