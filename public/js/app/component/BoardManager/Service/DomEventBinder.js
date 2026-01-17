// Service/DomEventBinder.js
export default class DomEventBinder {
    constructor(container, eventBus) {
        this.container = container;
        this.eventBus = eventBus;
        this.handler = this.handleClick.bind(this);
        this.container.addEventListener('click', this.handler);
    }

    handleClick(e) {
        const target = e.target.closest('[data-event]');
        if (!target || !this.container.contains(target)) return;

        e.preventDefault();

        const eventName = target.dataset.event;
        const payload = {
            ...target.dataset,
            id: target.closest('[data-item-id]')?.dataset.itemId
        };

        this.eventBus.emit(eventName, payload);
    }

    destroy() {
        this.container.removeEventListener('click', this.handler);
    }
}
