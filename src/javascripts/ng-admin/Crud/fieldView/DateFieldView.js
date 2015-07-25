define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-date-column field="::field" value="::entry.values[field.name()]"></ma-date-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getFilterWidget() {
        return '<ma-date-field field="::field" value="values[field.name()]"></ma-date-field>';
    }
    function getWriteWidget() {
        return '<ma-date-field field="::field" value="entry.values[field.name()]"></ma-date-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
