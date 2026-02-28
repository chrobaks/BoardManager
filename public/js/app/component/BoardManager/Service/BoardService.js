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
        this.store = dependencies.store ?? null;
        this.view = dependencies.view ?? null;
        this.events = dependencies.eventBus ?? null;
        this.idService = dependencies.idService ?? null;
        this.uiState = dependencies.uiState ?? null;
        this.dataType = dependencies.dataType ?? null;
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
        try {
            this.store.update(data)
            if (this.uiState.isBoardView(this.dataType)) {
                this.view.render(this.store.all());
            } else {
                if (this.dataType === 'category') {
                    this.updateCategory();
                } else if (this.dataType === 'item') {
                    this.updateItems();
                }
            }
        } catch(e) {
            console.error('ERROR:BoardService:updateByDataType', e, data);
            throw e;
        }
    }

    updateCategory() {
        const cat = this.store.getById(this.uiState.getActiveId(this.dataType));
        if (!cat?.items) {
            throw new Error(`ERROR:BoardService:updateCategory category not found.`);
        }
        this.view.renderNodeData(cat);
        this.events.emit('item:show:cat:items', cat.items);
    }

    updateItems() {
        const item = this.store.getById(this.uiState.getActiveId(this.dataType));
        if (!item) {
            throw new Error(`ERROR:BoardService:updateItems category not found.`);
        }
        this.view.renderNodeData(item);
    }

    deleteItemFromCategory(data) {
        const activeId = this.uiState.getActiveId(this.dataType);
        if (!activeId) {
            throw new Error(`ERROR:BoardService:deleteItemFromCategory activeId not found.`);
        }

        const cat = this.store.getById(activeId);
        if (!cat) {
            throw new Error(`ERROR:BoardService:deleteItemFromCategory category not found.`);
        }
        this.store.removeItem(cat, data.id);

        return this.store.getById(activeId);
    }

    getCommitArguments(data) {
        const payload = this.store.normalize(data);
        const id = payload?.id ?? null;

        if (!id) {throw new Error(`ERROR:BoardService:getCommitArguments id not found.`);}

        const cache = {...this.store.getById(id)};
        if (!cache) { throw new Error(`ERROR:BoardService:getCommitArguments cache not found.`); }

        return {payload, cache};
    }
}