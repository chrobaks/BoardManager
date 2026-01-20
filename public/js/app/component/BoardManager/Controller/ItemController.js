import AbstractController from './AbstractController.js';

export default class ItemController extends AbstractController {
    constructor(store, view, eventBus, idService) {
        super(store, view, eventBus, idService, 'item');
    }

    init() {
        this.view.render(this.store.all());

        this.events.on('click:item:show', payload => this.show(payload));
        this.events.on('click:item:show:catItems', catItems => this.showCatItems(catItems));
        this.events.on('click:item:modal:form', () => this.modalForm());
        this.events.on('click:item:add', payload => this.add(payload));
        this.events.on('click:item:edit', payload => this.edit(payload));
        this.events.on('click:item:update', payload => this.update(payload));
        this.events.on('click:item:remove', id => this.remove(id));
        this.events.on('click:item:delete', payload => this.delete(payload));
        this.events.on('click:item:reset', () => {
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
        this.events.emit('click:category:delete:item', {id:id});
    }
}
