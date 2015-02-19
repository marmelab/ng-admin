define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-boolean-column value="::entry.values[field.name()]"></ma-boolean-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getWriteWidget() {
        return '<ma-checkbox-field field="::field" value="entry.values[field.name()]"></ma-checkbox-field>';
    }
    return {
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
