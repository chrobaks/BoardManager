import Ui from '../../../core/Ui.js';
import MessageView from './MessageView.js';

export default class AbstractView {
    constructor(container, wrapper, templateService) {
        this.container = container;
        this.wrapper = wrapper;
        this.templateService = templateService;

        this.initMessageView();
    }

    initMessageView() {
        if(this.container.querySelectorAll('.board-message').length) {
            this.messageView = new MessageView('.board-message');
            this.messageView.init(this.container);
        } else {
            this.messageView = null;
        }
    }

    showMessage(message) {
        if (!this.messageView) return;
        this.messageView.show(message);
    }

    isMobile() {
        return Ui.isMobile();
    }
}