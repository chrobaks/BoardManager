export default class FormRenderer
{

    static ignoreKeys = ['element', 'label', 'options', 'selected'];

    static render(formElements, form = {}, showLabelAfter = false) {
        const formWrapper = document.createElement('form');

        if (form?.selector) {
            formWrapper.classList.add(form.selector);
        }

        if (!formElements?.length) {
            return '';
        }

        formElements.forEach(obj => {
            const element = document.createElement(obj.element);
            const formRow = document.createElement('div');

            FormRenderer.prepareAttributes(element, obj);
            FormRenderer.prepareSelector(element, formRow, obj);
            FormRenderer.prepareSelect(element, obj);
            FormRenderer.formRowAppend(element, formRow, showLabelAfter, obj);

            formWrapper.appendChild(formRow);
        });

        return formWrapper.outerHTML;
    }

    static prepareAttributes(element, obj) {
        Object.keys(obj).forEach(key => {
            if (FormRenderer.ignoreKeys.includes(key)) return;

            if (key === 'required') {
                element.setAttribute('required', 'required');
            } else {
                element.setAttribute(key, obj[key]);
            }
        });
    }

    static prepareSelector(element, formRow, obj) {
        if (obj?.selector) {
            obj.selector.split(' ').forEach(cls => {
                element.classList.add(cls.trim());
                if (cls.trim() === 'build-in') {
                    formRow.classList.add('picker-build-in-wrapper');
                }
            });
        }
    }

    static prepareSelect(element, obj) {
        if (obj.element === 'select' && obj.options) {
            obj.options.forEach(data => {
                const option = document.createElement('option');
                option.value = data.id;
                option.innerText = data.name;

                if (obj?.selected?.includes(data.id)) {
                    option.setAttribute("selected","selected");
                }
                element.append(option);
            });
        }
    }

    static formRowAppend(element, formRow, showLabelAfter, obj) {
        let elementsToAppend = [element];
        if (obj?.label) {
            const label = document.createElement('label');
            label.innerText = obj.label;
            elementsToAppend =  showLabelAfter
                ? [element, label]
                : [label, element];
        }
        formRow.append(...elementsToAppend);
    }
}
