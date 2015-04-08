import ListView from './ListView';

class ExportView extends ListView {
    constructor(name) {
        super(name);
        this._type = 'ExportView';
    }
}

export default ExportView;
