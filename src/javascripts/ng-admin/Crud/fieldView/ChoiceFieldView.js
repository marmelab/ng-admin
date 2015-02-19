define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-string-column value="::field.getLabelForChoice(entry.values[field.name()])"></ma-string-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getWriteWidget() {
        return '<ma-choice-field field="::field" value="entry.values[field.name()]"></ma-choice-field>';
    }
    return {
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
