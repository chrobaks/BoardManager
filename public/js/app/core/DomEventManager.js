
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
                this.root.addEventListener(eventType, (event) => this.handleEvent(event));
            });
        } catch (e) {
            console.error('Error:DomEventManager:init', e);
        }
    }
    handleEvent(event) {
        try {
            const target = event.target.closest('[data-event]');
            if (!target) return;

            const action = target.dataset.event;

            this.eventBus.emit(`${event.type}:${action}`, {
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

    addDesktopHoverEvents() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) {
            if (!this.supportedEvents.includes('mouseover')) this.supportedEvents.push('mouseover');
            if (!this.supportedEvents.includes('mouseout')) this.supportedEvents.push('mouseout');
        }
    }
}