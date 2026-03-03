import { BOARD_EVENT_ACTIONS } from '../BoardManager.js';

export default class AbstractController {
    constructor(store, view, domEventManager, idService, boardState, dataType) {
        this.store = store;
        this.view = view;
        this.domEventManager = domEventManager;
        this.idService = idService;
        this.boardState = boardState;
        this.dataType = dataType;
        this.error = [];
        this._activeListeners = [];
    }

    initEvents(eventList) {
        try {
            if (eventList.length) {
                eventList.forEach(event => {
                    let eventAct = this.domEventManager.eventIdentifier(this.dataType, event.action);
                    if(this.activeListenerExistsByEventAct(eventAct)) {
                        return;
                    }

                    let callback = event?.callback ?? null;

                    if (!callback) {
                        if (event.eventName) {
                            eventAct = this.domEventManager.eventIdentifier(event.eventName, eventAct);
                            if(this.activeListenerExistsByEventAct(eventAct)) {
                                return;
                            }
                        }
                        const methodName = event.action.replace(/:([a-z])/g, (m) => m[1].toUpperCase());
                        if (typeof this[methodName] === 'function') {
                            callback = this[methodName].bind(this)
                        } else {
                            return;
                        }
                    }

                    this.domEventManager.eventBus.on(eventAct, callback);
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
                const eventAct = this.domEventManager.eventIdentifier('click', [this.dataType, action]);

                if(this.activeListenerExistsByEventAct(eventAct)) {
                    return;
                }

                const methodName = action.replace(/:([a-z])/g, (m) => m[1].toUpperCase());

                if (typeof this[methodName] === 'function') {
                    const boundCallback = this[methodName].bind(this);
                    this.domEventManager.eventBus.on(eventAct, boundCallback);
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
        this.domEventManager.eventBus.on(eventAct, boundCallback);
        this._activeListeners.push({ eventAct, boundCallback });
    }

    destroy() {
        this._activeListeners.forEach(({ eventAct, boundCallback }) => {
            this.domEventManager.eventBus.off(eventAct, boundCallback);
        });
        this._activeListeners = [];
        if (this.view && typeof this.view.destroy === 'function') {
            this.view.destroy();
        }
    }

    setMessage(message, action = 'show') {
        try {
            const dataType = (message?.dataType ? message.dataType : this.dataType);
            this.domEventManager.eventBus.emit(
                this.domEventManager.eventIdentifier(dataType, ['message', action]),
                message
            );
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
