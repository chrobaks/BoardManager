import AbstractController from './AbstractController.js';

export default class ItemController extends AbstractController {
    constructor(store, view, eventBus, idService, uiState) {
        super(store, view, eventBus, idService, uiState, 'item');

        this.init([
            {action:'add'},
            {action:'revert:add'},
            {action:'remove'},
            {action:'reset'},
            {action:'revert'},
            {action:'update'},
            {action:'revert:update'},
            {action:'show:catItems', callback :  catItems => this.showCatItems(catItems)},
        ]);
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
