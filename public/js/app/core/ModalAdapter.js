
import Modal from './Modal.js'

export default class ModalAdapter {
    constructor() {
        this.modal = new Modal();
    }

    setTitle(title) {
        this.modal.setTitle(title);
    }

    /**
     * @param {string} html
     * @param {Object} options { type: 'save'|'prompt', onSubmit: function }
     */
    setContent(html, options = {}) {
        if (options.type) {
            this.modal.modalType = options.type;
            this.modal.renderButtons();
        }

        this.modal.renderBody(html, options);
    }

    close() {
        this.modal.display();
    }

    getModalForm() {
        return this.modal.modalBody.querySelector('form') || this.modal.modalBody;
    }
}
