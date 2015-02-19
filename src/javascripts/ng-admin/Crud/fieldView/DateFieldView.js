define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-date-column field="::field" value="::entry.values[field.name()]"></ma-date-column>';
    }
    function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    }
    function getWriteWidget() {
        return '<div class="row"><ma-date-field field="::field" value="entry.values[field.name()]" class="col-sm-4"></ma-date-field></div>';
    }
    return {
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
