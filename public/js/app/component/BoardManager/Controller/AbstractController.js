import { BOARD_EVENT_ACTIONS } from '../BoardManager.js';

export default class AbstractController {
    /**
     *
     * @param store
     * @param view
     * @param eventBus
     * @param idService
     * @param dataType
     */
    constructor(store, view, eventBus, idService, dataType) {
        this.store = store;
        this.view = view;
        this.events = eventBus;
        this.idService = idService;
        this.dataType = dataType;
        this.error = [];
    }

    initListHeightAndEnableScroll() {
        try {
            const threshold = this.view.getScrollThreshold();
            const currentCount = this.view.getChildrenLength();

            if (currentCount > threshold) {
                this.view.freezeCurrentListHeightAndEnableScroll();
            }

            this.view.applyScrollLimitIfNeeded(threshold);
        } catch (e) {
            console.error('ERROR:AbstractController:initListHeightAndEnableScroll', e);
        }
    }

    initEvents(eventList) {
        try {
            if (eventList.length) {
                eventList.forEach(event => {
                    const eventAct = `${this.dataType}:${event.action}`;
                    let callback = event?.callback ?? null;
                    if (!callback) {
                        const methodName = event.action.replace(/:([a-z])/g, (m) => m[1].toUpperCase());
                        if (typeof this[methodName] === 'function') {
                            callback = payload => this[methodName](payload);
                        } else {
                            return;
                        }
                    }
                    this.events.on(eventAct, callback);
                });
            }
        } catch (e) {
            console.error('ERROR:AbstractController:initEvents', e);
        }
    }

    bindUserClickEvents() {
        try {
            Object.values(BOARD_EVENT_ACTIONS).forEach(action => {
                const eventName = `click:${this.dataType}:${action}`;
                const methodName = action.replace(/:([a-z])/g, (m) => m[1].toUpperCase());

                this.events.on(eventName, payload => {
                    if (typeof this[methodName] === 'function') {
                        this[methodName](payload);
                    } else {
                        console.warn(`Action ${action} triggered, but method ${methodName} is not implemented in ${this.constructor.name}`);
                    }
                });
            });
        } catch (e) {
            console.error('ERROR:AbstractController:bindUserClickEvents', e);
        }
    }

    setUIState(uiState) {
        this.uiState = uiState;
    }

    setError(error) {
        this.error.push(error);
    }
    getError(doReset = false) {
        const error = [... this.error];
        if (doReset) {this.error = []}

        return error;
    }

    modalForm() {
        this.events.emit('modal:open:form', {type: this.dataType, payload: {id: 0}});
        this.events.emit('category:reset', {});
        this.events.emit('item:reset', {});
    }

    edit(data) {
        const payload = this.store.normalize(data);
        const obj = this.store.getById(payload.id);
        if (obj) {
            this.events.emit('modal:open:form', {type: this.dataType, payload: obj});
        }
    }

    add(data) {
        try {
            const threshold = this.view.getScrollThreshold();
            const currentCount = this.store.currentCount();

            if (currentCount === threshold) {
                this.view.freezeCurrentListHeightAndEnableScroll();
            }

            data.id = this.idService.next();
            this.store.add(data);
            this.view.render(this.store.all());
            this.view.renderBoardItemsCount();

            this.view.applyScrollLimitIfNeeded(threshold);
            this.view.scrollIntoView();

            this.events.emit('commit:add', {
                action: 'add',
                type: this.dataType,
                payload: data
            });
        } catch (e) {
            console.error('ERROR:AbstractController:add', e);
        }
    }

    revertUpdate(data) {
        if (data?.cache && this.store.update(data.cache)) {
            this.events.emit('commit:reverted', data.index + 1);
        }
    }

    update(data) {
        try {
            const payload = this.store.normalize(data);
            const id = payload?.id ?? null;

            if (!id) { return; }

            const cache = {...this.store.getById(id)};
            if (!cache) { return; }

            const emitPayload = {
                action: 'update',
                type: this.dataType,
                payload: payload,
                cache
            }

            if (!this.store.update(data)) { return; }

            if (this.uiState.isBoardView(this.dataType)) {
                this.view.render(this.store.all());
            } else {
                if (this.dataType === 'category') {
                    const cat = this.store.getById(this.uiState.getActiveId(this.dataType));
                    if (cat && cat?.items) {
                        this.view.renderNodeData(cat);
                        this.events.emit('item:show:catItems', cat.items);
                    }
                } else if (this.dataType === 'item') {
                    const item = this.store.getById(this.uiState.getActiveId(this.dataType));
                    this.view.renderNodeData(item);
                }
            }
            this.events.emit('commit:add', emitPayload);
        } catch (e) {
            console.error('ERROR:AbstractController:update', e);
        }
    }

    delete(data) {
        try {
            const payload = this.store.normalize(data);
            const obj = {...this.store.getById(payload.id)};
            if (obj) {
                this.events.emit('modal:prompt:delete', {type: this.dataType, payload: obj});
            }
        } catch (e) {
            console.error('ERROR:AbstractController:delete', e);
        }
    }

    reset() {
        try {
            this.view.render(this.store.all());
            this.view.displayItemKeyBox('itemBoardLength', true);
            this.uiState.showBoard(this.dataType);
        } catch (e) {
            console.error('ERROR:AbstractController:reset', e);
        }
    }

    revert(data) {
        try {
            const payload = this.store.normalize(data.cache);
            if (payload && payload.id) {
                this.store.addById(payload);
                this.events.emit('commit:reverted', data.index + 1);
            }
        } catch (e) {
            console.error('ERROR:AbstractController:revert', e);
        }
    }

    remove(id) {
        // Needed, if the commit has a restore action
        const itemCache = this.store.getById(id);
        const commitConf = {
            action: 'delete',
            type: this.dataType,
            payload: { id },
            cache: itemCache
        };
        let setCommit = false;

        if (this.dataType === 'category') {
            this.store.remove(id);
            this.view.render(this.store.all());

            if (this.uiState.isCategoryView()) {
                this.uiState.showBoard('category');
            }
            this.events.emit('item:reset', {});
            this.view.renderBoardItemsCount();

            setCommit = true;
        }

        if (this.dataType === 'item') {
            this.events.emit('category:delete:item', {id:id});

            if (this.uiState.isBoardView('category')) {
                this.store.remove(id);
                this.view.render(this.store.all());
            }

            if (!this.uiState.isCategoryView()) {
                setCommit = true;
            }

            this.view.renderBoardItemsCount();
        }

        if (setCommit) {
            this.events.emit('commit:add', commitConf);
        }
    }
}