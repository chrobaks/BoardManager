import Ui from '../../../core/Ui.js';

export default class MessageView {
    constructor(selector) {
        this.selector = selector;
        this.container = null;
        this.icon = null;
    }

    init(container) {
        const selectorDesktop = `[${this.selector}='desktop']`;
        const selectorMobile = `[${this.selector}='mobile']`;

        if (Ui.isMobile() && container.querySelector(selectorMobile)) {
            this.container = container.querySelector(selectorMobile);
        } else {
            this.container = container.querySelector(selectorDesktop);
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
    }

    clear() {
        this.container.innerText = '';
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
