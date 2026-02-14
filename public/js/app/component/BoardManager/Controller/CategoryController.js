import BoardController from './BoardController.js';
import CategoryService from '../Service/CategoryService.js';

export default class CategoryController extends BoardController {
    constructor(store, view, eventBus, idService, uiState) {
        super(store, view, eventBus, idService, uiState, 'category', CategoryService);

        this.init([
            {action:'add'},
            {action:'remove'},
            {action:'reset'},
            {action:'update'},
            {action:'revert:add'},
            {action:'revert:update'},
            {action:'revert:delete'},
            {action:'delete:item'},
            {action:'revert:item'},
            {action:'message:show'},
        ]);
        this.setMessage({ text: `Package board loaded`, type: 'info' });
    }

    revertItem(data) {
        try {
            this.store.reinsertItem(data);
            this.events.emit('commit:reverted', data.index + 1);
        } catch (error) {
            console.error('ERROR:CategoryController:revertItem', error);
        }
    }

    deleteItem(data) {
        try {
            const payload = {itemId: data.id};
            let emitAction = 'deleteItemFromAll';
            let cache = [];

            if (this.uiState.isBoardView(this.dataType)) {
                cache = this.store.removeItemFromAll(data.id);
            } else {
                const cat = this.service.deleteItemFromCategory(data);
                this.events.emit('item:show:cat:items', cat.items);
                emitAction = 'deleteItemFromCategory';
                cache = [cat.id];
            }
            this.service.updateCategoryItemCount();
            if (this.store.notEmpty(cache)) {
                this.events.emit('commit:add', {
                    action: emitAction,
                    type: this.dataType,
                    payload: payload,
                    cache: cache
                });
            }
        } catch (error) {
            console.error('ERROR:CategoryController:deleteItem', error);
        }
    }
}
