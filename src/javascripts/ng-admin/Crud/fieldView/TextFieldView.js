define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-string-column value="::entry.values[field.name()]"></ma-string-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getFilterWidget() {
        return '<ma-input-field field="::field" value="values[field.name()]"></ma-input-field>';
    }
    function getWriteWidget() {
        return '<ma-text-field field="::field" value="entry.values[field.name()]"></ma-text-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
