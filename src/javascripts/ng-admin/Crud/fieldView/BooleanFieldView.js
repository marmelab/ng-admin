define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-boolean-column value="::entry.values[field.name()]"></ma-boolean-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getFilterWidget() {
        return '<ma-button-field field="::field" value="values[field.name()]"></ma-button-field>';
    }
    function getWriteWidget() {
        return '<ma-checkbox-field field="::field" value="entry.values[field.name()]"></ma-checkbox-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
