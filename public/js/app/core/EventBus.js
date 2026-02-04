export default class EventBus {
    constructor() {
        this.events = {};
    }

    on(event, handler) {
        try {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(handler);
        } catch (e) {
            console.error('ERROR:EventBus:on', e);
        }
    }

    emit(event, payload = null) {
        try {
            if (!this.events[event]) {
                return;
            }
            this.events[event].forEach(handler => handler(payload));
        } catch (e) {
            console.error('ERROR:EventBus:emit',event, e);
        }
    }

    off(event, handler) {
        try {
            if (!this.events[event]) {
                return;
            }
            this.events[event] = this.events[event].filter(h => h !== handler);
        } catch (e) {
            console.error('ERROR:EventBus:off', e);
        }
    }
}
