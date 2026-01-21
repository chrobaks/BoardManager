import FormRenderer from '../Service/FormRenderer.js';
import Form from '../../../core/Form.js';
import Validator from '../../../core/Validator.js';

export default class ModalController {
    constructor(modal, eventBus, formFactory) {
        this.modal = modal;
        this.events = eventBus;
        this.formFactory = formFactory;
    }

    init () {
        this.events.on('modal:open:form', data => this.openForm(data));
        this.events.on('modal:prompt:delete', data => this.openPromptDelete(data));
    }

    openForm(obj = {}) {
        if (obj?.type && obj?.payload) {
            this.modal.setTitle(
                obj.payload.id ? 'Daten bearbeiten' : 'Neue Daten anlegen'
            );

            const formAction = obj.type + 'Form';
            const form = this.formFactory[formAction](obj.payload);
            const html = FormRenderer.render(form.dom, { selector: 'one-row-form' }, true);

            this.modal.setContent(html, {
                type: 'save',
                onSubmit: () => {
                    try {
                        const formContainer = this.modal.getModalForm();
                        const data = Form.serialize(formContainer);

                        let errors = [];
                        if (form.formType) {
                            errors = Validator.validate(data, form.formType);
                        }

                        if (errors.length > 0) {
                            Form.showErrors(formContainer, errors);
                            return false;
                        }

                        this.events.emit(obj.payload.id ? obj.type + ':update' : obj.type + ':add', data);

                        return true;
                    } catch (e) {
                        console.error('ERROR:ModalController:openForm', e);

                        return false;
                    }
                }
            });
        }
    }

    openPromptDelete (obj = {}) {
        if (obj?.type && obj.payload) {
            this.modal.setTitle('Sicherheitsabfrage');
            this.modal.setContent(
                '<div class="alert alert-danger">Daten wirklich löschen?</div>',
                {
                    type: 'prompt',
                    onSubmit: () => {
                        this.events.emit(obj.type + ':remove', obj.payload?.id);
                    }
                }
            );
        }
    }
}
