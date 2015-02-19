define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-template-column entry="::entry" field="::field" entity="::entity"></ma-template-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getWriteWidget() {
        return '<ma-template-field entry="entry" field="::field" entity="::entity"></ma-template-field>';
    }
    return {
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
