
export default class DomEventManager {
    /**
     * @param {HTMLElement} rootElement
     * @param {EventBus} eventBus
     */
    constructor(rootElement, eventBus) {
        this.root = rootElement;
        this.eventBus = eventBus;
        this.supportedEvents = ['click', 'input', 'change', 'submit', 'mouseover', 'mouseleave', 'keyup'];
        this.init();
    }

    init() {
        this.supportedEvents.forEach(eventType => {
            this.root.addEventListener(eventType, (event) => this.handleEvent(event));
        });
    }
    handleEvent(event) {
        const target = event.target.closest('[data-event]');
        if (!target) return;

        const action = target.dataset.event;

        this.eventBus.emit(`${event.type}:${action}`, {
            ...target.dataset,
            id: target.closest('[data-item-id]')?.dataset.itemId,
            value: target.value || target.dataset.value || null,
            originalEvent: event
        });
    }
}