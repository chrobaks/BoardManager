import { BOARD_EVENT_ACTIONS } from '../BoardManager.js';

export default class AbstractController {
    constructor(store, view, eventBus, idService, uiState, dataType) {
        this.store = store;
        this.view = view;
        this.events = eventBus;
        this.idService = idService;
        this.uiState = uiState;
        this.dataType = dataType;
        this.error = [];
        this._activeListeners = [];
    }

    initEvents(eventList) {
        try {
            if (eventList.length) {
                eventList.forEach(event => {
                    let eventAct = `${this.dataType}:${event.action}`;

                    if(this.activeListenerExistsByEventAct(eventAct)) {
                        return;
                    }

                    let callback = event?.callback ?? null;

                    if (!callback) {
                        if (event.eventName) {
                            eventAct = `${event.eventName}:${eventAct}`;
                        }
                        const methodName = event.action.replace(/:([a-z])/g, (m) => m[1].toUpperCase());
                        if (typeof this[methodName] === 'function') {
                            callback = this[methodName].bind(this)
                        } else {
                            return;
                        }
                    }

                    this.events.on(eventAct, callback);
                    this._activeListeners.push({ eventAct, callback });
                });
            }

            this.bindUserClickEvents();
        } catch (e) {
            console.error('ERROR:AbstractController:initEvents', e);
        }
    }

    bindUserClickEvents() {
        try {
            const eventActions = (this.dataType === 'commit') ? BOARD_EVENT_ACTIONS[this.dataType] : BOARD_EVENT_ACTIONS['board'];
            if (!eventActions) {return;}
            Object.values(eventActions).forEach(action => {
                const eventAct = `click:${this.dataType}:${action}`;

                if(this.activeListenerExistsByEventAct(eventAct)) {
                    return;
                }

                const methodName = action.replace(/:([a-z])/g, (m) => m[1].toUpperCase());

                if (typeof this[methodName] === 'function') {
                    const boundCallback = this[methodName].bind(this);
                    this.events.on(eventAct, boundCallback);
                    this._activeListeners = this._activeListeners || [];
                    this._activeListeners.push({ eventAct, boundCallback });
                } else {
                    console.warn(`Action ${action} triggered, but method ${methodName} is not implemented in ${this.constructor.name}`);
                }
            });
        } catch (e) {
            console.error('ERROR:AbstractController:bindUserClickEvents', e);
        }
    }

    activeListenerExistsByEventAct(eventAct) {
        return this._activeListeners.some(listener => listener.eventAct === eventAct);
    }

    addBusListener(eventAct, callback) {
        const boundCallback = callback.bind(this);
        this.events.on(eventAct, boundCallback);
        this._activeListeners.push({ eventAct, boundCallback });
    }

    destroy() {
        this._activeListeners.forEach(({ eventAct, boundCallback }) => {
            this.events.off(eventAct, boundCallback);
        });
        this._activeListeners = [];
        if (this.view && typeof this.view.destroy === 'function') {
            this.view.destroy();
        }
    }

    setMessage(message, action = 'show') {
        try {
            const dataType = (message?.dataType ? message.dataType : this.dataType);
            this.events.emit(`${dataType}:message:${action}`, message);
        } catch (e) {
            console.error('ERROR:AbstractController:setMessage', e);
        }
    }

    setError(error) { this.error.push(error); }

    getError(doReset = false) {
        const error = [...this.error];
        if (doReset) { this.error = []; }
        return error;
    }

    messageShow(payload) {
        this.view.showMessage(payload);
    }


}
