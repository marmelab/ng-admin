import View from './View';

class DeleteView extends View {
    constructor(name) {
        super(name);
        this._type = 'DeleteView';
        this._enabled = true;
    }
}

export default DeleteView;
