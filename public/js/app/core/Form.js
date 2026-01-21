export default class Form {
    static serialize(container) {
        const inputs = container.querySelectorAll("input, select, textarea");
        const data = {};

        for (const input of inputs) {
            if (!input.name) continue;

            if (input.tagName === 'SELECT' && input.multiple) {
                data[input.name] = Array.from(input.selectedOptions).map(opt => opt.value);
            } else {
                data[input.name] = input.value.trim();
            }
        }
        return data;
    }

    static validate(container) {
        const errors = [];
        const inputs = container.querySelectorAll("input, select, textarea");

        for (const input of inputs) {
            const isRequired = input.hasAttribute('required') || input.dataset.required === 'true';

            if (isRequired && !input.value.trim()) {
                errors.push({
                    field: input.name,
                    message: `Das Feld "${input.title || input.name}" ist ein Pflichtfeld.`
                });
            }
        }
        return errors;
    }

    static showErrors(container, errorList) {
        container.querySelectorAll('.error-msg').forEach(el => el.remove());
        container.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        for (const err of errorList) {
            const input = container.querySelector(`[name="${err.field}"]`);
            const inputWrapper = input.closest('div');
            if (input) {
                input.classList.add('is-invalid');
                const msg = document.createElement('div');
                msg.className = 'error-msg text-danger small mb-1';
                msg.textContent = err.message;
                inputWrapper.after(msg);
            }
        }
    }
}