
export default class DomEventManager {
    /**
     * @param {HTMLElement} rootElement
     * @param {EventBus} eventBus
     * @param options
     */
    constructor(rootElement, eventBus, options = {}) {
        this.root = rootElement;
        this.eventBus = eventBus;
        this.defaultEvents = ['click', 'input', 'change', 'submit', 'keyup', 'contextmenu'];
        this.customerEvents = {};

        this.handleEvent = this.handleEvent.bind(this);
        this.init(options);
    }

    init(options) {
        try {
            if (options?.override) {
                this.supportedEvents = options.events || [...this.defaultEvents];
            } else {
                this.supportedEvents = [...new Set([...this.defaultEvents, ...(options?.additionalEvents || [])])];
            }

            this.addDesktopHoverEvents();
            this.supportedEvents.forEach(eventType => {
                this.root.addEventListener(eventType, this.handleEvent);
            });
        } catch (e) {
            console.error('Error:DomEventManager:init', e);
        }
    }

    initCustomerEvents(dataType, events) {
        this.customerEvents[dataType] = events;
    }

    handleEvent(event) {
        try {
            const target = event.target.closest('[data-event]');
            if (!target) return;

            const action = target.dataset.event;
            const eventIdentifier= this.eventIdentifier(event.type, action);
            this.eventBus.emit(eventIdentifier, {
                ...target.dataset,
                id: target.closest('[data-item-id]')?.dataset.itemId,
                targetValue: target.value || target.dataset.value || null,
                originalEvent: event,
                targetElement: target
            });
        } catch (e) {
            console.error('Error:DomEventManager:handleEvent', e, event);
        }
    }

    destroy() {
        this.supportedEvents.forEach(eventType => {
            this.root.removeEventListener(eventType, this.handleEvent);
        });
    }

    addDesktopHoverEvents() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) {
            if (!this.supportedEvents.includes('mouseover')) this.supportedEvents.push('mouseover');
            if (!this.supportedEvents.includes('mouseout')) this.supportedEvents.push('mouseout');
        }
    }

    eventIdentifierFromCustomer(dataType, commit) {
        if ( !commit?.type
            || !commit?.action
            || !this.customerEvents?.[dataType]?.[commit.action]) { return ''; }

        return this.eventIdentifier(commit.type, this.customerEvents[dataType][commit.action]);
    }

    eventIdentifier(type, action) {
        if (typeof type !== 'string'
            || typeof action !== 'string' && !Array.isArray(action)
            || !type.length
            || !action.length) {
                throw new Error('ERROR:DomEventManager:eventIdentifier Invalid event identifier');
            }
        if (Array.isArray(action)) {
            action = action.join(':');
        }
        return `${type}:${action}`;
    }
}