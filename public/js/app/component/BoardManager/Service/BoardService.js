export default class BoardService {
    /**
     *
     * @param dependencies
     * @param dependencies.store instances of Store
     * @param dependencies.view instances of  BoardView
     * @param dependencies.eventBus instances of  EventBus
     * @param dependencies.idService instances of  IdService
     * @param dependencies.uiState UiState
     * @param dependencies.dataType string
     */
    constructor(dependencies) {
        try {
            this.store = dependencies.store ?? null;
            this.view = dependencies.view ?? null;
            this.events = dependencies.eventBus ?? null;
            this.idService = dependencies.idService ?? null;
            this.uiState = dependencies.uiState ?? null;
            this.dataType = dependencies.dataType ?? null;
        } catch(err) {
            console.error('ERROR:BoardService:constructor', err);
        }
    }

    addData(data) {
        data.id = this.idService.next();
        const addOk = this.store.add(data);
        if (addOk) {
            this.view.render(this.store.all());
            this.view.renderBoardItemsCount();
            this.view.applyScrollLimitIfNeeded();
            this.view.scrollIntoView();
        }

        return addOk;
    }

    updateByDataType(data) {
        let isOk = false;
        if (!this.store.update(data)) { return isOk; }
        try {
            if (this.uiState.isBoardView(this.dataType)) {
                this.view.render(this.store.all());
                isOk = true;
            } else {
                if (this.dataType === 'category') {
                    isOk = this.updateCategory();
                } else if (this.dataType === 'item') {
                    isOk = this.updateItems();
                }
            }
        } catch(err) {
            console.error('ERROR:BoardService:constructor', err, data);
            return false;
        }

        return isOk;
    }

    updateCategory() {
        const cat = this.store.getById(this.uiState.getActiveId(this.dataType));
        if (cat && cat?.items) {
            this.view.renderNodeData(cat);
            this.events.emit('item:show:cat:items', cat.items);
            return true;
        }

        return false;
    }

    updateItems() {
        const item = this.store.getById(this.uiState.getActiveId(this.dataType));
        if (item) {
            this.view.renderNodeData(item);
            return true;
        }

        return false;
    }

    deleteItemFromCategory(data) {
        try {
            const activeId = this.uiState.getActiveId(this.dataType);
            if (!activeId) { return null; }
            const cat = this.store.getById(activeId);
            this.store.removeItem(cat, data.id);

            return cat;
        } catch(err) {
            console.error('ERROR:BoardService:deleteItemFromCategory', err);
        }
        return null;
    }

    removeCategory(id) {
        try {
            this.store.remove(id);
            this.view.render(this.store.all());

            if (this.uiState.isCategoryView()) {
                this.uiState.showBoard(this.dataType);
            }
            this.events.emit('item:reset', {});
            this.view.renderBoardItemsCount();
        } catch(err) {
            console.error('ERROR:BoardService:removeCategory', err);
        }
    }

    removeItem(id) {
        try {
            this.events.emit('category:delete:item', {id: id});

            if (this.uiState.isBoardView('category')) {
                this.store.remove(id);
                this.view.render(this.store.all());
            }
        } catch(err) {
            console.error('ERROR:BoardService:removeItem', err);
        }
    }

    getCommitArguments(data) {
        const args = {payload:null, cache: null};
        const payload = this.store.normalize(data);

        const id = payload?.id ?? null;
        if (!id) { return args; }

        const cache = {...this.store.getById(id)};
        if (!cache) { return args; }

        return {payload, cache};
    }
}