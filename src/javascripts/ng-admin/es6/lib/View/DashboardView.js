import ListView from './ListView';

class DashboardView extends ListView {
    constructor(name) {
        super(name);
        this._type = 'DashboardView';
    }
}

export default DashboardView;
