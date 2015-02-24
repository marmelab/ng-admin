define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-string-column value="::entry.listValues[field.name()]"></ma-string-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoReference()">' + getReadWidget() + '</a>';
    }
    function getFilterWidget() {
        return '<ma-choice-field field="::field" value="values[field.name()]"></ma-choice-field>';
    }
    function getWriteWidget() {
        return '<ma-choice-field field="::field" value="entry.values[field.name()]"></ma-choice-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
