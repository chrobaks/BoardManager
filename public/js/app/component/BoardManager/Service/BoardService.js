export default class BoardService {
    /**
     *
     * @param dependencies
     * @param dependencies.store instances of Store
     * @param dependencies.view instances of  BoardView
     * @param dependencies.eventBus instances of  EventBus
     * @param dependencies.idService instances of  IdService
     * @param dependencies.boardState instances of BoardState
     * @param dependencies.dataType string
     */
    constructor(dependencies) {
        this.store = dependencies.store ?? null;
        this.view = dependencies.view ?? null;
        this.events = dependencies.eventBus ?? null;
        this.idService = dependencies.idService ?? null;
        this.boardState = dependencies.boardState ?? null;
        this.dataType = dependencies.dataType ?? null;
    }

    addData(data) {
        const addOk = this.addToStore(data);
        if (addOk) {
            this.afterAddUi();
        }

        return addOk;
    }

    addToStore(data) {
        data.id = this.idService.next();
        return this.store.add(data);
    }

    afterAddUi() {
        this.view.render(this.store.all());
        this.view.renderBoardItemsCount();
        this.view.applyScrollLimitIfNeeded();
        this.view.scrollIntoView();
    }

    updateByDataType(data) {
        try {
            this.updateInStore(data);
            this.afterUpdateUi(data);
        } catch(e) {
            console.error('ERROR:BoardService:updateByDataType', e, data);
            throw e;
        }
    }

    updateInStore(data) {
        this.store.update(data);
    }

    afterUpdateUi(data) {
        if (this.boardState.isBoardView(this.dataType)) {
            this.view.render(this.store.all());
            return;
        }

        if (this.dataType === 'category') {
            this.updateCategory();
        } else if (this.dataType === 'item') {
            this.updateItems();
        }
    }

    updateCategory() {
        const cat = this.store.getById(this.boardState.getActiveId(this.dataType));

        if (!cat?.items) {
            throw new Error(`ERROR:BoardService:updateCategory category not found.`);
        }

        this.view.renderNodeData(cat);
        this.events.emit('item:show:cat:items', cat.items);
    }

    updateItems() {
        const item = this.store.getById(this.boardState.getActiveId(this.dataType));
        if (!item) {
            throw new Error(`ERROR:BoardService:updateItems category not found.`);
        }
        this.view.renderNodeData(item);
    }

    deleteItemFromCategory(data) {
        const activeId = this.boardState.getActiveId(this.dataType);
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