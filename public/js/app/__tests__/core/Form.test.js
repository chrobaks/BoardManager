import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Form from '../../core/Form.js';

describe('Form', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe('serialize', () => {
        it('should serialize form inputs to object', () => {
            container.innerHTML = `
        <input type="text" name="username" value="john">
        <input type="email" name="email" value="john@example.com">
      `;

            const data = Form.serialize(container);
            expect(data).toEqual({
                username: 'john',
                email: 'john@example.com'
            });
        });

        it('should trim whitespace from input values', () => {
            container.innerHTML = `
        <input type="text" name="username" value="  john  ">
      `;

            const data = Form.serialize(container);
            expect(data.username).toBe('john');
        });

        it('should serialize textarea', () => {
            container.innerHTML = `
        <textarea name="message">Hello World</textarea>
      `;

            const data = Form.serialize(container);
            expect(data.message).toBe('Hello World');
        });

        it('should serialize select single value', () => {
            container.innerHTML = `
        <select name="country">
          <option value="de">Germany</option>
          <option value="us" selected>USA</option>
        </select>
      `;

            const data = Form.serialize(container);
            expect(data.country).toBe('us');
        });

        it('should serialize select multiple values as array', () => {
            container.innerHTML = `
        <select name="skills" multiple>
          <option value="js" selected>JavaScript</option>
          <option value="ts" selected>TypeScript</option>
          <option value="py">Python</option>
        </select>
      `;

            const data = Form.serialize(container);
            expect(data.skills).toEqual(['js', 'ts']);
        });

        it('should skip inputs without name attribute', () => {
            container.innerHTML = `
        <input type="text" name="username" value="john">
        <input type="text" value="noname">
      `;

            const data = Form.serialize(container);
            expect(data).toEqual({ username: 'john' });
        });

        it('should handle empty form', () => {
            const data = Form.serialize(container);
            expect(data).toEqual({});
        });

        it('should serialize all input types', () => {
            container.innerHTML = `
        <input type="text" name="text" value="hello">
        <input type="number" name="age" value="25">
        <input type="checkbox" name="agree" checked>
        <input type="radio" name="gender" value="male" checked>
      `;

            const data = Form.serialize(container);
            expect(data.text).toBe('hello');
            expect(data.age).toBe('25');
        });
    });

    describe('validate', () => {
        it('should return empty array for valid form', () => {
            container.innerHTML = `
        <input type="text" name="username" value="john" required>
        <input type="email" name="email" value="john@example.com" required>
      `;

            const errors = Form.validate(container);
            expect(errors).toEqual([]);
        });

        it('should validate required attribute', () => {
            container.innerHTML = `
        <input type="text" name="username" value="" required>
        <input type="email" name="email" value="john@example.com">
      `;

            const errors = Form.validate(container);
            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('username');
            expect(errors[0].message).toContain('Pflichtfeld');
        });

        it('should validate data-required attribute', () => {
            container.innerHTML = `
        <input type="text" name="city" value="" data-required="true" title="City">
      `;

            const errors = Form.validate(container);
            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('city');
        });

        it('should validate multiple required fields', () => {
            container.innerHTML = `
        <input type="text" name="first" value="" required>
        <input type="text" name="second" value="" required>
        <input type="text" name="third" value="filled" required>
      `;

            const errors = Form.validate(container);
            expect(errors.length).toBe(2);
        });

        it('should use field title in error message', () => {
            container.innerHTML = `
        <input type="text" name="username" title="Username" value="" required>
      `;

            const errors = Form.validate(container);
            expect(errors[0].message).toContain('Username');
        });

        it('should use field name if title not available', () => {
            container.innerHTML = `
        <input type="text" name="username" value="" required>
      `;

            const errors = Form.validate(container);
            expect(errors[0].message).toContain('username');
        });

        it('should validate textareas', () => {
            container.innerHTML = `
        <textarea name="message" required></textarea>
      `;

            const errors = Form.validate(container);
            expect(errors.length).toBe(1);
        });

        it('should validate selects', () => {
            container.innerHTML = `
        <select name="country" required>
          <option value="">Select...</option>
        </select>
      `;

            const errors = Form.validate(container);
            expect(errors.length).toBe(1);
        });

        it('should trim whitespace in validation', () => {
            container.innerHTML = `
        <input type="text" name="username" value="   " required>
      `;

            const errors = Form.validate(container);
            expect(errors.length).toBe(1);
        });
    });

    describe('showErrors', () => {
        it('should add error-msg class to error message', () => {
            container.innerHTML = `
        <div><input type="text" name="username" value="" required></div>
      `;

            const errors = [{ field: 'username', message: 'Username is required' }];
            Form.showErrors(container, errors);

            const errorMsg = container.querySelector('.error-msg');
            expect(errorMsg).toBeTruthy();
            expect(errorMsg.textContent).toBe('Username is required');
        });

        it('should add is-invalid class to input', () => {
            container.innerHTML = `
        <div><input type="text" name="username" value=""></div>
      `;

            const errors = [{ field: 'username', message: 'Required' }];
            Form.showErrors(container, errors);

            const input = container.querySelector('input');
            expect(input.classList.contains('is-invalid')).toBe(true);
        });

        it('should remove previous error messages', () => {
            container.innerHTML = `
        <div><input type="text" name="username" value=""></div>
      `;

            // First set of errors
            let errors = [{ field: 'username', message: 'Error 1' }];
            Form.showErrors(container, errors);
            expect(container.querySelectorAll('.error-msg').length).toBe(1);

            // Second set of errors (should replace)
            errors = [{ field: 'username', message: 'Error 2' }];
            Form.showErrors(container, errors);
            expect(container.querySelectorAll('.error-msg').length).toBe(1);
            expect(container.querySelector('.error-msg').textContent).toBe('Error 2');
        });

        it('should place error message after input wrapper', () => {
            container.innerHTML = `
        <div id="wrapper"><input type="text" name="username" value=""></div>
      `;

            const errors = [{ field: 'username', message: 'Required' }];
            Form.showErrors(container, errors);

            const errorMsg = container.querySelector('.error-msg');
            const wrapper = container.querySelector('#wrapper');
            expect(errorMsg.previousElementSibling).toBe(wrapper);
        });

        it('should clear all is-invalid classes before showing new errors', () => {
            container.innerHTML = `
        <div><input type="text" name="first" class="is-invalid"></div>
        <div><input type="text" name="second" value=""></div>
      `;

            const errors = [{ field: 'second', message: 'Required' }];
            Form.showErrors(container, errors);

            expect(container.querySelector('input[name="first"]').classList.contains('is-invalid')).toBe(false);
            expect(container.querySelector('input[name="second"]').classList.contains('is-invalid')).toBe(true);
        });

        it('should handle empty error list', () => {
            container.innerHTML = `
        <div><input type="text" name="username" value="" class="is-invalid"></div>
      `;

            Form.showErrors(container, []);

            expect(container.querySelector('input').classList.contains('is-invalid')).toBe(false);
            expect(container.querySelector('.error-msg')).toBeFalsy();
        });

        it('should handle multiple errors', () => {
            container.innerHTML = `
        <div><input type="text" name="username" value=""></div>
        <div><input type="email" name="email" value=""></div>
      `;

            const errors = [
                { field: 'username', message: 'Username required' },
                { field: 'email', message: 'Email required' }
            ];
            Form.showErrors(container, errors);

            expect(container.querySelectorAll('.error-msg').length).toBe(2);
            expect(container.querySelectorAll('.is-invalid').length).toBe(2);
        });
    });
});