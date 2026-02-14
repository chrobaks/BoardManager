import BoardService from './BoardService.js';

export default class ItemService extends BoardService {
    constructor(dependencies) {
        super(dependencies);
    }

    show(data) {
        const payload = this.store.normalize(data);
        if (!('id' in payload) || (payload.id ?? null) === null) {
            throw new Error(`ERROR:BoardService:showCategory payload id not found.`);
        }

        this.view.toggleBoxItem(payload.id);
        if (this.uiState.isBoardView(this.dataType)) {
            this.uiState.showItem(payload.id);
            this.view.displayItemKeyBox('itemBoardLength', false);
        } else {
            this.uiState.showBoard(this.dataType);
            this.view.displayItemKeyBox('itemBoardLength', true);
        }
    }

    remove(id) {
        try {
            this.events.emit('category:delete:item', {id: id});

            if (this.uiState.isBoardView('category')) {
                this.store.remove(id);
                this.view.render(this.store.all());
            }
        } catch(err) {
            console.error('ERROR:BoardService:removeItem', err);
        }
    }
}