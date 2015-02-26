import ListView from './ListView';

class DashboardView extends ListView {
    constructor(entity) {
        super(entity);
        this._type = 'DashboardView';
    }
}

export default DashboardView;
