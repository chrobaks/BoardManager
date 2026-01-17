import AbstractController from './AbstractController.js';

export default class CategoryController extends AbstractController {
    constructor(store, view, eventBus, idService) {
        super(store, view, eventBus, idService, 'category');
    }

    init() {
        this.view.render(this.store.all());

        this.events.on('category:show', data => this.show(data));
        this.events.on('category:modal:form', () => this.modalForm());
        this.events.on('category:add', data => this.add(data));
        this.events.on('category:edit', data => this.edit(data));
        this.events.on('category:update', data => this.update(data));
        this.events.on('category:delete', data => this.delete(data));
        this.events.on('category:delete:item', data => this.deleteItem(data));
        this.events.on('category:remove', data => this.remove(data));
        this.events.on('category:reset', () => {
            this.view.render(this.store.all());
        });
    }

    show(data) {
        const payload = this.store.normalize(data);
        if (payload?.id && payload.id) {
                const cat = this.store.getById(payload.id);
                let catItems = null;

                this.view.toggleBoxItem(payload.id);

                if (this.uiState.isBoardView('category')) {
                    this.uiState.showCategory(payload.id);
                    catItems = cat.items;
                } else {
                    this.uiState.showBoard('category');
                }
                this.events.emit('item:show:catItems', catItems);
        }
    }

    update(data) {
        this.store.update(data);
        if (this.uiState.isBoardView('category')) {
            this.view.render(this.store.all());
        } else {
            const cat = this.store.getById(this.uiState.getActiveId('category'));
            if (cat && cat?.items) {
                this.view.renderNodeData(cat);
                this.events.emit('item:show:catItems', cat.items);
            }

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
        if (this.uiState.isBoardView('category')) {
            this.store.removeItemFromAll(data.id);
        } else {
            const cat = this.store.getById(Number(this.uiState.getActiveId('category')));
            this.store.removeItem(cat, data.id);
            this.events.emit('item:show:catItems', cat.items);
        }
        this.updateCategoryItemCount();
    }

    remove(id) {
        this.store.remove(id);
        this.view.render(this.store.all());
        if (this.uiState.isCategoryView()) {
            this.uiState.showBoard('category');
        }
        this.events.emit('item:reset', {});
    }
}
