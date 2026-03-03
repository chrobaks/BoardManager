import ModalFormService from '../Service/ModalFormService.js';

export default class ModalController {
    /**
     * @param {ModalAdapter} modal
     * @param {DomEventManager} domEventManager
     * @param {FormFactory} formFactory
     */
    constructor(modal, domEventManager, formFactory) {
        this.modal = modal;
        this.domEventManager = domEventManager;
        this.formFactory = formFactory;

        this.modalFormService = new ModalFormService(this.domEventManager.eventBus, this.formFactory, this.modal);
    }

    init () {
        this.domEventManager.eventBus.on('modal:open:form', data => this.openForm(data));
        this.domEventManager.eventBus.on('modal:prompt:delete', data => this.openPromptDelete(data));
    }

    openForm(obj = {}) {
        try {
            const { title, html, onSubmit } = this.modalFormService.build(obj);

            this.modal.setTitle(title);
            this.modal.setContent(html, {type: 'save', onSubmit});
        } catch (e) {
            console.error('ERROR:ModalController:openForm', e);
        }
    }

    openPromptDelete (obj = {}) {
        if (obj?.type && obj.payload) {
            const msg = (obj?.msg) ? obj.msg : 'Really delete data?';
            this.modal.setTitle('Security check');
            this.modal.setContent(
                '<div class="alert alert-danger">' + msg + '</div>',
                {
                    type: 'prompt',
                    onSubmit: () => {
                        this.domEventManager.eventBus.emit(obj.type + ':remove', obj.payload?.id);
                    }
                }
            );
        }
    }
}
