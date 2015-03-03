import View from './View';

class CreateView extends View {
    constructor(entity) {
        super(entity);
        this._type = 'CreateView';
    }
}

export default CreateView;
