define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-choices-column values="::entry.values[field.name()]"></ma-choices-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getFilterWidget() {
        return '<ma-choices-field field="::field" value="values[field.name()]"></ma-choices-field>';
    }
    function getWriteWidget() {
        return '<ma-choices-field field="::field" value="entry.values[field.name()]"></ma-choices-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
