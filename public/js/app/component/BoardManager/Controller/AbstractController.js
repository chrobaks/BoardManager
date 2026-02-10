import { BOARD_EVENT_ACTIONS } from '../BoardManager.js';
import BoardService from '../Service/BoardService.js';

export default class AbstractController {
    /**
     *
     * @param store
     * @param view
     * @param eventBus
     * @param idService
     * @param uiState
     * @param dataType
     */
    constructor(store, view, eventBus, idService, uiState, dataType) {
        try {
            this.store = store;
            this.view = view;
            this.events = eventBus;
            this.idService = idService;
            this.uiState = uiState;
            this.dataType = dataType;
            this.boardService = new BoardService({store, view, eventBus, uiState, dataType});
            this.error = [];
        } catch (e) {
            console.error('ERROR:AbstractController:initListHeightAndEnableScroll', e);
        }
    }

    init(eventList) {
        this.view.render(this.store.all());
        this.initListHeightAndEnableScroll();
        /**
         * Data Lifecycle & Domain Logic Events
         * Unlike the UI click events automated in bindUserClickEvents(), these listeners
         * are explicitly registered to handle internal application logic and store updates.
         */
        this.initEvents(eventList);
    }

    initListHeightAndEnableScroll() {
        try {
            this.view.applyScrollLimitIfNeeded();
        } catch (e) {
            console.error('ERROR:AbstractController:constructor', e);
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

            this.bindUserClickEvents();
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
            data.id = this.idService.next();
            this.store.add(data);
            this.view.render(this.store.all());
            this.view.renderBoardItemsCount();
            this.view.applyScrollLimitIfNeeded();
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
    revertAdd(data) {
        if (data?.payload && data.payload?.id && this.store.remove(data.payload.id)) {
            this.events.emit('commit:reverted', data.index + 1);
        } else {
            console.error('ERROR:AbstractController:revertAd', data);
        }
    }

    update(data) {
        try {
            const {payload, cache} = this.boardService.getCommitArguments(data);
            if (!payload || !cache) {
                console.error('ERROR:AbstractController:update getCommitArguments');
                return;
            }
            if  (this.boardService.updateByDataType(data)) {
                this.events.emit('commit:add', {
                    action: 'update',
                    type: this.dataType,
                    payload: payload,
                    cache
                });
            }
        } catch (e) {
            console.error('ERROR:AbstractController:update', e);
        }
    }

    revertUpdate(data) {
        if (data?.cache && this.store.update(data.cache)) {
            this.events.emit('commit:reverted', data.index + 1);
        } else {
            console.error('ERROR:AbstractController:revertUpdate', data);
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
        try {
            // Needed, if the commit has a restore action
            const itemCache = {...this.store.getById(id)};
            let setCommit = false;

            if (this.dataType === 'category') {
                this.boardService.removeCategory(id);
                setCommit = true;
            }

            if (this.dataType === 'item') {
                this.boardService.removeItem(id);
                if (!this.uiState.isCategoryView()) {
                    setCommit = true;
                }
            }
            this.view.renderBoardItemsCount();
            if (setCommit) {
                this.events.emit('commit:add', {
                    action: 'delete',
                    type: this.dataType,
                    payload: {id},
                    cache: itemCache
                });
            }
        } catch (e) {
            console.error('ERROR:AbstractController:remove', e);
        }
    }
}