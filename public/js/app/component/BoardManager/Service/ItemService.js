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
        if (this.boardState.isBoardView(this.dataType)) {
            this.boardState.showItem(payload.id);
            this.view.displayItemKeyBox('itemBoardLength', false);
        } else {
            this.boardState.showBoard(this.dataType);
            this.view.displayItemKeyBox('itemBoardLength', true);
        }
    }

    remove(id) {
        try {
            this.domEventManager.eventBus.emit('category:delete:item', {id: id});

            if (this.boardState.isBoardView('category')) {
                this.store.remove(id);
                this.view.render(this.store.all());
            }
        } catch(err) {
            console.error('ERROR:BoardService:removeItem', err);
        }
    }
}