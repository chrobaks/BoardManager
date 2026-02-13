import BoardController from './BoardController.js';

export default class CategoryController extends BoardController {
    constructor(store, view, eventBus, idService, uiState) {
        super(store, view, eventBus, idService, uiState, 'category');

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
            const itemId = data?.payload?.itemId ?? null;

            if (!itemId || !data?.payload?.itemId) return;

            this.store.reinsertItem(data.cache, itemId);
            this.events.emit('commit:reverted', data.index + 1);

        } catch (error) {
            console.error('ERROR:CategoryController:revertItem', error);
        }
    }

    show(data) {
        try {
            const payload = this.store.normalize(data);
            if (payload?.id && payload.id) {
                const cat = this.store.getById(payload.id);

                if (!cat) return;

                let catItems = null;

                this.view.toggleBoxItem(payload.id);

                if (this.uiState.isBoardView(this.dataType)) {
                    catItems = cat.items;
                    this.uiState.showCategory(payload.id);
                    this.view.displayItemKeyBox('itemBoardLength', false);
                } else {
                    this.uiState.showBoard(this.dataType);
                    this.view.displayItemKeyBox('itemBoardLength', true);
                }
                this.events.emit('item:show:cat:items', catItems);
            }
        } catch (error) {
            console.error('ERROR:CategoryController:sho', error);
        }
    }

    updateCategoryItemCount () {
        try {
            const categories = this.store.all();
            if (categories && categories.length) {
                categories.forEach(cat => {
                    if (cat.id && cat.items) {
                        const node = this.view.getElementContainer(cat.id);
                        if (node) {
                            this.view.renderDataItemKeyValue(node, 'items_length', cat.items.length);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('ERROR:CategoryController:updateCategoryItemCount', error);
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
                if (!cat) return;
                this.events.emit('item:show:cat:items', cat.items);
                emitAction = 'deleteItemFromCategory';
                cache = [cat.id];
            }
            this.updateCategoryItemCount();
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
