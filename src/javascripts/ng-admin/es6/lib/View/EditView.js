import View from './View';

class EditView extends View {
    constructor(entity) {
        super(entity);
        this._type = 'EditView';
    }
}

export default EditView;
