export default class MessageView {
    constructor(container) {
        this.container = container;
    }

    show(message, type = 'info') {
        this.container.innerText = message;
        this.container.className = `alert alert-${type}`;
    }

    clear() {
        this.container.innerText = '';
        this.container.className = '';
    }
}
