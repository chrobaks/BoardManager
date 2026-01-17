export default class EventBusService {
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
            console.error('ERROR:EventBusService:on', e);
        }
    }

    emit(event, payload = null) {
        try {
            if (!this.events[event]) {
                return;
            }
            this.events[event].forEach(handler => handler(payload));
        } catch (e) {
            console.error('ERROR:EventBusService:emit', e);
        }
    }

    off(event, handler) {
        try {
            if (!this.events[event]) {
                return;
            }
            this.events[event] = this.events[event].filter(h => h !== handler);
        } catch (e) {
            console.error('ERROR:EventBusService:off', e);
        }
    }
}
