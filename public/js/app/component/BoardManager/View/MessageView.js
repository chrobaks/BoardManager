import Ui from '../../../core/Ui.js';

export default class MessageView {
    constructor(selector) {
        this.selector = selector;
        this.container = null;
        this.icon = null;
    }

    init(container) {
        if (Ui.isMobile() && container.querySelector(this.selector + '.mobile')) {
            this.container = container.querySelector(this.selector + '.mobile')
        } else {
            this.container = [...container.querySelectorAll(this.selector)].find(el => !el.classList.contains('mobile'));
        }
        const wrapper = this.container?.parentElement?.closest('div');
        this.icon = wrapper.querySelector('i.fa') ?? null;
    }

    show(message) {
        if (!this.container) return;
        this.container.innerText = message?.text ?? '';
        if (this.icon) {
            this.messageIcon(message.type);
        }
        // this.container.className = `alert alert-${message.type}`;
    }

    clear() {
        this.container.innerText = '';
        this.container.className = '';
    }

    messageIcon(type) {
        const iconConf = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'danger': 'exclamation-triangle',
            'error': 'exclamation-circle'
        }
        if (!iconConf[type]) return;
        this.icon.className = `fa fa-${iconConf[type]}`;
    }
}
