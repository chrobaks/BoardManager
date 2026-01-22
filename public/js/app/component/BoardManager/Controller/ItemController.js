import AbstractController from './AbstractController.js';

export default class ItemController extends AbstractController {
    constructor(store, view, eventBus, idService) {
        super(store, view, eventBus, idService, 'item');
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
        this.events.on('item:add', payload => this.add(payload));
        this.events.on('item:update', payload => this.update(payload));
        this.events.on('item:show:catItems', catItems => this.showCatItems(catItems));
        this.events.on('item:remove', id => this.remove(id));
        this.events.on('item:reset', () => this.reset());
    }

    show(data) {
        const payload = this.store.normalize(data);
        if (payload?.id && payload.id) {
            this.view.toggleBoxItem(payload.id);
            if (this.uiState.isBoardView('item')) {
                this.uiState.showItem(payload.id);
                this.view.displayItemKeyBox('itemBoardLength', false);
            } else {
                this.uiState.showBoard('item');
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
        this.view.renderBoardItemsCount();
    }
}
