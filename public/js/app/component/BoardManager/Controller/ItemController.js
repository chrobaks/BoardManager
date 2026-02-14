import BoardController from './BoardController.js';
import ItemService from '../Service/ItemService.js';

export default class ItemController extends BoardController {
    constructor(store, view, eventBus, idService, uiState) {
        super(store, view, eventBus, idService, uiState, 'item', ItemService);

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
