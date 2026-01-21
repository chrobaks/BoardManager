import { BOARD_EVENT_ACTIONS } from '../BoardManager.js';


export default class AbstractController {
    constructor(store, view, eventBus, idService, dataType) {
        this.store = store;
        this.view = view;
        this.events = eventBus;
        this.idService = idService;
        this.dataType = dataType;
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
        data.id = this.idService.next();
        this.store.add(data);
        this.view.render(this.store.all());
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
    }
}