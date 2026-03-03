// public/js/app/component/BoardManager/Service/ModalFormService.js
import FormRenderer from './FormRenderer.js';
import Form from '../../../core/Form.js';
import Validator from '../../../core/Validator.js';

export default class ModalFormService {
    constructor(domEventManager, formFactory, modal) {
        this.domEventManager = domEventManager;
        this.formFactory = formFactory;
        this.modal = modal;
    }

    build(obj = {}) {
        const mode = obj?.mode === 'update' ? 'update' : 'add';
        const title = mode === 'update' ? 'Edit data' : 'Create new data';

        if (!obj?.type || !obj?.payload) {
            throw new Error('ERROR:ModalFormService:build invalid payload');
        }

        const formAction = obj.type + 'Form';
        const form = this.formFactory[formAction](obj.payload);
        const html = FormRenderer.render(form.dom, { selector: 'one-row-form' }, true);
        const event = `${obj.type}:${mode}`;

        const onSubmit = () => {
            try {
                const formContainer = this.modal.getModalForm();
                const data = Form.serialize(formContainer);

                let errors = [];
                if (form.formType) {
                    errors = Validator.validate(data, form.formType, mode);
                }

                if (errors.length > 0) {
                    Form.showErrors(formContainer, errors);
                    return false;
                }

                this.domEventManager.eventBus.emit(event, data);
                return true;
            } catch (e) {
                console.error('ERROR:ModalFormService:onSubmit', e);
                return false;
            }
        };

        return { title, html, onSubmit };
    }
}