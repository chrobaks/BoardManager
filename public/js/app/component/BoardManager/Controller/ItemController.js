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
        this.initEvents([
            {action:'add'},
            {action:'revert:add'},
            {action:'remove'},
            {action:'reset'},
            {action:'revert'},
            {action:'update'},
            {action:'revert:update'},
            {action:'item:show:catItems', callback :  catItems => this.showCatItems(catItems)},
        ]);
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
}
