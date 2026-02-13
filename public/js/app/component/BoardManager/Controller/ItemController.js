import BoardController from './BoardController.js';

export default class ItemController extends BoardController {
    constructor(store, view, eventBus, idService, uiState) {
        super(store, view, eventBus, idService, uiState, 'item');

        this.init([
            {action:'add'},
            {action:'remove'},
            {action:'reset'},
            {action:'update'},
            {action:'revert:add'},
            {action:'revert:update'},
            {action:'revert:delete'},
            {action:'show:cat:items'},
            {action:'message:show'},
        ]);
        this.setMessage({ text: `Bundle board loaded`, type: 'info' });
    }

    show(data) {
        const payload = this.store.normalize(data);
        if (payload?.id && payload.id) {
            this.view.toggleBoxItem(payload.id);
            if (this.uiState.isBoardView(this.dataType)) {
                this.uiState.showItem(payload.id);
                this.view.displayItemKeyBox('itemBoardLength', false);
            } else {
                this.uiState.showBoard(this.dataType);
                this.view.displayItemKeyBox('itemBoardLength', true);
            }
        }
    }

    showCatItems(catItems) {
        if (catItems) {
            let items = [];
            catItems.forEach(id => items.push(this.store.getById(id)));
            this.view.render(items);
            this.uiState.showBoard('item');
        } else {
            this.view.render(this.store.all());
        }
        this.view.displayItemKeyBox('itemBoardLength', true);
    }
}
