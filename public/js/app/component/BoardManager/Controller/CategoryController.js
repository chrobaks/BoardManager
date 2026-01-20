import AbstractController from './AbstractController.js';

export default class CategoryController extends AbstractController {
    constructor(store, view, eventBus, idService) {
        super(store, view, eventBus, idService, 'category');
    }

    init() {
        this.view.render(this.store.all());

        this.events.on('click:category:show', payload => this.show(payload));
        this.events.on('click:category:modal:form', () => this.modalForm());
        this.events.on('click:category:add', payload => this.add(payload));
        this.events.on('click:category:edit', payload => this.edit(payload));
        this.events.on('click:category:update', payload => this.update(payload));
        this.events.on('click:category:delete', payload => this.delete(payload));
        this.events.on('click:category:delete:item', payload => this.deleteItem(payload));
        this.events.on('click:category:remove', payload => this.remove(payload));
        this.events.on('click:category:reset', () => {
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
                this.events.emit('click:item:show:catItems', catItems);
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
                this.events.emit('click:item:show:catItems', cat.items);
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
            this.events.emit('click:item:show:catItems', cat.items);
        }
        this.updateCategoryItemCount();
    }

    remove(id) {
        this.store.remove(id);
        this.view.render(this.store.all());
        if (this.uiState.isCategoryView()) {
            this.uiState.showBoard('category');
        }
        this.events.emit('click:item:reset', {});
    }
}
