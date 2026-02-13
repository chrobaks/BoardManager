import BoardService from '../Service/BoardService.js';
import AbstractController from './AbstractController.js';

export default class BoardController extends AbstractController {
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
            super(store, view, eventBus, idService, uiState, dataType);
            this.service = new BoardService({store, view, eventBus, idService, uiState, dataType});
            this.error = [];
        } catch (e) {
            console.error('ERROR:BoardController:initListHeightAndEnableScroll', e);
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
            console.error('ERROR:BoardController:constructor', e);
        }
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
            if (this.service.addData(data)) {
                this.setMessage({text: `Add new data succeed.`, type: 'success'});
                this.events.emit('commit:add', {
                    action: 'add',
                    type: this.dataType,
                    payload: data
                });
            } else {
                this.setMessage({text: `Add new data failed.`, type: 'warning'});
            }
        } catch (e) {
            console.error('ERROR:BoardController:add', e);
        }
    }

    update(data) {
        try {
            const {payload, cache} = this.service.getCommitArguments(data);
            this.service.updateByDataType(data);
            this.setMessage({ text: `Update data succeed.`, type: 'success' });
            this.events.emit('commit:add', {
                action: 'update',
                type: this.dataType,
                payload: payload,
                cache
            });
        } catch (e) {
            console.error('ERROR:BoardController:update', e);
            this.setMessage({ text: `Update data failed.`, type: 'warning' });
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
            console.error('ERROR:BoardController:delete', e);
        }
    }

    reset() {
        try {
            this.view.render(this.store.all());
            this.view.displayItemKeyBox('itemBoardLength', true);
            this.uiState.showBoard(this.dataType);
        } catch (e) {
            console.error('ERROR:BoardController:reset', e);
        }
    }

    revertUpdate(data) {
        try {
            if (!data?.cache) {
                throw new Error(`ERROR:AbstractStore:revertUpdate data.cache not found.`);
            }
            this.store.update(data.cache);
            this.setMessage({ text: `Update commit successfully reverted`, type: 'success' });
            this.nextIndexRevert(data);
        } catch (e) {
            console.error('ERROR:BoardController:revertUpdate', e);
            this.setMessage({text: `Revert update commit failed.`, type: 'warning'});
        }
    }

    revertAdd(data) {
        if (data?.payload && data.payload?.id && this.store.remove(data.payload.id)) {
            this.setMessage({ text: `Add commit successfully reverted`, type: 'success' });
            this.nextIndexRevert(data);
        } else {
            console.error('ERROR:BoardController:revertAd', data);
            this.setMessage({text: `Revert add commit failed.`, type: 'warning'});
        }
    }

    revertDelete(data) {
        try {
            const payload = this.store.normalize(data.cache);
            if (payload && payload.id) {
                this.store.addById(payload);
                this.setMessage({ text: `Delete commit successfully reverted`, type: 'success' });
                this.nextIndexRevert(data);
            }
        } catch (e) {
            console.error('ERROR:BoardController:revert', e);
        }
    }

    nextIndexRevert (data) {
        if (/^\d*$/.test(`${data.index}`)) {
            this.events.emit('commit:reverted', data.index + 1);
        }
    }

    remove(id) {
        try {
            const revertCache = {...this.store.getById(id)};
            let setCommit = false;

            if (this.dataType === 'category') {
                this.service.removeCategory(id);
                setCommit = true;
            }

            if (this.dataType === 'item') {
                this.service.removeItem(id);
                if (!this.uiState.isCategoryView()) {
                    setCommit = true;
                }
            }
            this.view.renderBoardItemsCount();
            this.setMessage({ text: `Delete data succeed.`, type: 'success' });
            if (setCommit) {
                this.events.emit('commit:add', {
                    action: 'delete',
                    type: this.dataType,
                    payload: {id},
                    cache: revertCache
                });
            }
        } catch (e) {
            console.error('ERROR:BoardController:remove', e);
        }
    }
}