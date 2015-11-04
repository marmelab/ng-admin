export default class FieldViewConfiguration {
    constructor() {
        this.fieldViews = {};
    }

    registerFieldView(type, FieldView) {
        this.fieldViews[type] = FieldView;
    }

    $get() {
        return this.fieldViews;
    }
}

FieldViewConfiguration.$inject = [];
