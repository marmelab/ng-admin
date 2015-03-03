import View from './View';

class EditionView extends View {
    constructor(entity) {
        super(entity);
        this._title = 'Edit ' + entity.name();
    }
}

export default EditionView;
