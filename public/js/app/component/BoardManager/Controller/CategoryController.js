import AbstractController from './AbstractController.js';

export default class CategoryController extends AbstractController {
    constructor(store, view, eventBus, idService) {
        super(store, view, eventBus, idService, 'category');
    }

    init() {
        this.view.render(this.store.all());

        this.initListHeightAndEnableScroll();

        this.bindUserClickEvents();
        /**
         * Data Lifecycle & Domain Logic Events
         * Unlike the UI click events automated in bindUserClickEvents(), these listeners
         * are explicitly registered to handle internal application logic and store updates.
         */
        this.initEvents([
            {action:'add'},
            {action:'remove'},
            {action:'reset'},
            {action:'revert'},
            {action:'update'},
            {action:'revert:update'},
            {action:'delete:item', callback :  payload => this.deleteItem(payload)},
            {action:'revert:item', callback :  (payload) => this.revertItem(payload)},
        ]);
    }

    revertItem(data) {
        try {
            const itemId = data?.payload?.itemId ?? null;

            if (itemId && data?.cache) {
                if (this.store.reinsertItem(data.cache, itemId)) {
                    this.events.emit('commit:reverted', data.index + 1);
                }
            }
        } catch (error) {
            console.error('ERROR:CategoryController:revertItem', error);
        }
    }

    show(data) {
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

            this.events.emit('item:show:catItems', catItems);
        }
    }

    updateCategoryItemCount () {
        const categories = this.store.all();
        if (categories && categories.length) {
            categories.forEach(cat => {
                if (cat.id && cat.items) {
                    const node = this.view.getElementContainer(cat.id);
                    if (node) {this.view.renderDataItemKeyValue(node, 'items_length', cat.items.length);}
                }
            });
        }
    }

    deleteItem(data) {
        const payload = { itemId: data.id };
        let emitAction = 'deleteItemFromAll';
        let cache = [];

        if (this.uiState.isBoardView(this.dataType)) {
            cache = this.store.removeItemFromAll(data.id);
        } else {
            const cat = this.store.getById(Number(this.uiState.getActiveId(this.dataType)));
            this.store.removeItem(cat, data.id);
            this.events.emit('item:show:catItems', cat.items);
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
    }
}
