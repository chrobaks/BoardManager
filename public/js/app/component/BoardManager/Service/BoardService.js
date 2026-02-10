export default class BoardService {
    constructor(dependencies) {
        try {
            this.store = dependencies.store ?? null;
            this.view = dependencies.view ?? null;
            this.events = dependencies.eventBus ?? null;
            this.uiState = dependencies.uiState ?? null;
            this.dataType = dependencies.dataType ?? null;
        } catch(err) {
            console.error('ERROR:BoardService:constructor', err);
        }
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
            this.events.emit('item:show:catItems', cat.items);
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