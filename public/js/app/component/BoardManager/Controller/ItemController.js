import AbstractController from './AbstractController.js';

export default class ItemController extends AbstractController {
    constructor(store, view, eventBus, idService) {
        super(store, view, eventBus, idService, 'item');
    }

    init() {
        this.view.render(this.store.all());

        this.events.on('item:show', data => this.show(data));
        this.events.on('item:show:catItems', catItems => this.showCatItems(catItems));
        this.events.on('item:modal:form', () => this.modalForm());
        this.events.on('item:add', data => this.add(data));
        this.events.on('item:edit', data => this.edit(data));
        this.events.on('item:update', data => this.update(data));
        this.events.on('item:remove', id => this.remove(id));
        this.events.on('item:delete', data => this.delete(data));
        this.events.on('item:reset', () => {
            this.view.render(this.store.all());
        });
    }

    show(data) {
        const payload = this.store.normalize(data);
        if (payload?.id && payload.id) {
            this.view.toggleBoxItem(payload.id);
            if (this.uiState.isBoardView('item')) {
                this.uiState.showItem(payload.id);
            } else {
                this.uiState.showBoard('item');
            }
        }
    }

    showCatItems(catItems) {

        if (catItems) {
            let items = [];
            catItems.forEach(id => items.push(this.store.getById(id)));
            this.view.render(items);
        } else {
            this.view.render(this.store.all());
        }
    }

    update(data) {
        this.store.update(data);
        if (this.uiState.isBoardView('item')) {
            this.view.render(this.store.all());
        } else {
            const item = this.store.getById(this.uiState.getActiveId('item'));
            this.view.renderNodeData(item);
        }
    }

    remove(id) {
        if (this.uiState.isBoardView('category')) {
            this.store.remove(id);
            this.view.render(this.store.all());
        }
        this.events.emit('category:delete:item', {id:id});
    }
}
