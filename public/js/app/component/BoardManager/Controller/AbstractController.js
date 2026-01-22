import { BOARD_EVENT_ACTIONS } from '../BoardManager.js';

export default class AbstractController {
    constructor(store, view, eventBus, idService, dataType) {
        this.store = store;
        this.view = view;
        this.events = eventBus;
        this.idService = idService;
        this.dataType = dataType;
    }

    initListHeightAndEnableScroll() {
        const threshold = this.getScrollThreshold();
        const currentCount = this.view.getChildrenLength();

        if (currentCount > threshold) {
            this.freezeCurrentListHeightAndEnableScroll();
        }

        this.applyScrollLimitIfNeeded(threshold);
    }

    bindUserClickEvents() {
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
    }

    setUIState(uiState) {
        this.uiState = uiState;
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
        const threshold = this.getScrollThreshold();
        const currentCount = this.store.currentCount();

        if (currentCount === threshold) {
            this.freezeCurrentListHeightAndEnableScroll();
        }

        data.id = this.idService.next();
        this.store.add(data);
        this.view.render(this.store.all());
        this.view.renderBoardItemsCount();

        this.applyScrollLimitIfNeeded(threshold);
        this.view.scrollIntoView();
    }

    delete(data) {
        const payload = this.store.normalize(data);
        const obj = this.store.getById(payload.id);
        if (obj) {
            this.events.emit('modal:prompt:delete', {type: this.dataType, payload: obj});
        }
    }

    reset() {
        this.view.render(this.store.all());
        this.view.displayItemKeyBox('itemBoardLength', true);
    }

    freezeCurrentListHeightAndEnableScroll() {
        const ul = this.view.wrapper;
        const height = Math.ceil(ul.getBoundingClientRect().height);

        ul.style.maxHeight = `${height}px`;
        ul.style.overflowY = 'auto';
        ul.style.overflowX = 'hidden';
        ul.style.webkitOverflowScrolling = 'touch';

    }

    applyScrollLimitIfNeeded(threshold) {

        threshold = threshold ?? this.getScrollThreshold();

        const ul = this.view.wrapper;
        const count = this.view.getChildrenLength();

        if (count <= threshold) {
            ul.style.maxHeight = '';
            ul.style.overflowY = '';
            ul.style.overflowX = '';
            ul.style.webkitOverflowScrolling = '';
            return;
        }

        const first = this.view.getFirstChildNode();
        const last = this.view.getChildAt(threshold - 1);
        if (!first || !last) return;

        const firstRect = first.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const height = Math.ceil(lastRect.bottom - firstRect.top);

        ul.style.maxHeight = `${height}px`;
        ul.style.overflowY = 'auto';
        ul.style.overflowX = 'hidden';
        ul.style.webkitOverflowScrolling = 'touch';
    }


    getScrollThreshold() {
        const isMobilePortrait = window.matchMedia('(max-width: 767.98px) and (orientation: portrait)').matches;
        return isMobilePortrait ? 4 : 6;
    }
}