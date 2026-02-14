import BoardService from './BoardService.js';

export default class CategoryService extends BoardService {
    constructor(dependencies) {
        super(dependencies);
    }

    updateCategoryItemCount () {
        const categories = this.store.all();
        if (!categories || !categories?.length) return;

        categories.forEach(cat => {
            if (!cat?.id || !cat?.items) return;
            const node = this.view.getElementContainer(cat.id);
            if (node) {
                this.view.renderDataItemKeyValue(node, 'items_length', cat.items.length);
            }
        });
    }

    show(data) {
        const payload = this.store.normalize(data);
        if (!('id' in payload) || (payload.id ?? null) === null) {
            throw new Error(`ERROR:CategoryService:show payload id not found.`);
        }

        const cat = this.store.getById(payload.id);
        if (!cat) throw new Error(`ERROR:CategoryService:show category not found.`);

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

    remove(id) {
        try {
            this.store.remove(id);
            this.view.render(this.store.all());

            if (this.uiState.isCategoryView()) {
                this.uiState.showBoard(this.dataType);
            }
            this.events.emit('item:reset', {});
            this.view.renderBoardItemsCount();
        } catch(err) {
            console.error('ERROR:CategoryService:remove', err);
        }
    }
}