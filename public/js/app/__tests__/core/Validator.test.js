import { describe, it, expect, vi } from 'vitest';
import Validator from '../../core/Validator.js';

describe('Validator', () => {
    describe('validate', () => {
        it('should return empty array for valid data', () => {
            const data = { username: 'john', email: 'john@example.com' };
            const schema = {
                username: {
                    constraints: [{ rule: 'required', message: 'Username required' }]
                },
                email: {
                    constraints: [{ rule: 'required', message: 'Email required' }]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors).toEqual([]);
        });

        it('should validate required field', () => {
            const data = { username: '' };
            const schema = {
                username: {
                    constraints: [{ rule: 'required', message: 'Username required' }]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(1);
            expect(errors[0].field).toBe('username');
            expect(errors[0].message).toBe('Username required');
        });

        it('should skip id field validation in create mode', () => {
            const data = { id: '' };
            const schema = {
                id: {
                    constraints: [{ rule: 'required', message: 'ID required' }]
                }
            };

            // Default mode is create (mode = '')
            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(0); // Skipped because id is auto-generated
        });

        it('should validate id field in update mode', () => {
            const data = { id: '' };
            const schema = {
                id: {
                    constraints: [{ rule: 'required', message: 'ID required' }]
                }
            };

            const errors = Validator.validate(data, schema, 'update');
            expect(errors.length).toBe(1); // Should validate because mode = 'update'
        });

        it('should validate min_length constraint', () => {
            const data = { password: 'abc' };
            const schema = {
                password: {
                    constraints: [
                        { rule: 'min_length', params: { value: 8 }, message: 'Min 8 chars' }
                    ]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(1);
            expect(errors[0].message).toBe('Min 8 chars');
        });

        it('should validate max_length constraint', () => {
            const data = { username: 'this_is_a_very_long_username' };
            const schema = {
                username: {
                    constraints: [
                        { rule: 'max_length', params: { value: 10 }, message: 'Max 10 chars' }
                    ]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(1);
        });

        it('should validate range constraint', () => {
            const data = { age: 5 };
            const schema = {
                age: {
                    constraints: [
                        { rule: 'range', params: { min: 18, max: 100 }, message: 'Age 18-100' }
                    ]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(1);
        });

        it('should stop at first constraint error per field', () => {
            const data = { username: '' };
            const schema = {
                username: {
                    constraints: [
                        { rule: 'required', message: 'Required' },
                        { rule: 'min_length', params: { value: 5 }, message: 'Min 5' }
                    ]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(1);
            expect(errors[0].message).toBe('Required');
        });

        it('should validate multiple fields with errors', () => {
            const data = { username: '', email: '' };
            const schema = {
                username: {
                    constraints: [{ rule: 'required', message: 'Username required' }]
                },
                email: {
                    constraints: [{ rule: 'required', message: 'Email required' }]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(2);
        });

        it('should skip fields without constraints', () => {
            const data = { username: 'john', phone: '' };
            const schema = {
                username: {
                    constraints: [{ rule: 'required', message: 'Required' }]
                },
                phone: {
                    // No constraints
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBe(0);
        });

        it('should use default message if none provided', () => {
            const data = { username: '' };
            const schema = {
                username: {
                    constraints: [{ rule: 'required' }]
                }
            };

            const errors = Validator.validate(data, schema);
            expect(errors[0].message).toBe('Invalid value for username');
        });

        it('should handle schema or data errors gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const data = null;
            const schema = { field: null };

            const errors = Validator.validate(data, schema);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some(e => e.field === '_general')).toBe(true);

            consoleSpy.mockRestore();
        });

        it('should handle empty schema', () => {
            const data = { username: 'john' };
            const schema = {};

            const errors = Validator.validate(data, schema);
            expect(errors).toEqual([]);
        });

        it('should accept mode parameter', () => {
            const data = { id: '' };
            const schema = {
                id: {
                    constraints: [{ rule: 'required' }]
                }
            };

            // Create mode (default)
            let errors = Validator.validate(data, schema, '');
            expect(errors.length).toBe(0);

            // Update mode
            errors = Validator.validate(data, schema, 'update');
            expect(errors.length).toBe(1);
        });
    });

    describe('checkRule', () => {
        it('should pass required rule for non-empty string', () => {
            const result = Validator.checkRule('username', 'john', { rule: 'required' }, '');
            expect(result).toBe(true);
        });

        it('should fail required rule for empty string', () => {
            const result = Validator.checkRule('username', '', { rule: 'required' }, '');
            expect(result).toBe(false);
        });

        it('should fail required rule for null', () => {
            const result = Validator.checkRule('username', null, { rule: 'required' }, '');
            expect(result).toBe(false);
        });

        it('should fail required rule for undefined', () => {
            const result = Validator.checkRule('username', undefined, { rule: 'required' }, '');
            expect(result).toBe(false);
        });

        it('should trim whitespace for required', () => {
            const result = Validator.checkRule('username', '   ', { rule: 'required' }, '');
            expect(result).toBe(false);
        });

        it('should pass min_length for valid length', () => {
            const result = Validator.checkRule('password', 'password123', {
                rule: 'min_length',
                params: { value: 8 }
            }, '');
            expect(result).toBe(true);
        });

        it('should fail min_length for short string', () => {
            const result = Validator.checkRule('password', 'pass', {
                rule: 'min_length',
                params: { value: 8 }
            }, '');
            expect(result).toBe(false);
        });

        it('should pass max_length for valid length', () => {
            const result = Validator.checkRule('username', 'pass', {
                rule: 'max_length',
                params: { value: 10 }
            }, '');
            expect(result).toBe(true);
        });

        it('should fail max_length for long string', () => {
            const result = Validator.checkRule('username', 'this_is_way_too_long', {
                rule: 'max_length',
                params: { value: 10 }
            }, '');
            expect(result).toBe(false);
        });

        it('should pass range for value in range', () => {
            const result = Validator.checkRule('age', 25, {
                rule: 'range',
                params: { min: 18, max: 100 }
            }, '');
            expect(result).toBe(true);
        });

        it('should fail range for value below min', () => {
            const result = Validator.checkRule('age', 5, {
                rule: 'range',
                params: { min: 18, max: 100 }
            }, '');
            expect(result).toBe(false);
        });

        it('should fail range for value above max', () => {
            const result = Validator.checkRule('age', 150, {
                rule: 'range',
                params: { min: 18, max: 100 }
            }, '');
            expect(result).toBe(false);
        });

        it('should pass range at exact min', () => {
            const result = Validator.checkRule('age', 18, {
                rule: 'range',
                params: { min: 18, max: 100 }
            }, '');
            expect(result).toBe(true);
        });

        it('should pass range at exact max', () => {
            const result = Validator.checkRule('age', 100, {
                rule: 'range',
                params: { min: 18, max: 100 }
            }, '');
            expect(result).toBe(true);
        });

        it('should handle NaN values in range', () => {
            const result = Validator.checkRule('age', 'abc', {
                rule: 'range',
                params: { min: 18, max: 100 }
            }, '');
            expect(result).toBe(false);
        });

        it('should return true for unknown rule', () => {
            const result = Validator.checkRule('field', 'any', { rule: 'unknown' }, '');
            expect(result).toBe(true);
        });

        it('should return true when no rule', () => {
            const result = Validator.checkRule('field', 'any', {}, '');
            expect(result).toBe(true);
        });

        it('should skip validation if params missing for min_length', () => {
            const result = Validator.checkRule('field', 'short', { rule: 'min_length' }, '');
            expect(result).toBe(true);
        });

        it('should skip validation if params missing for max_length', () => {
            const result = Validator.checkRule('field', 'verylongstring', { rule: 'max_length' }, '');
            expect(result).toBe(true);
        });

        it('should skip validation if params missing for range', () => {
            const result = Validator.checkRule('field', 999, { rule: 'range' }, '');
            expect(result).toBe(true);
        });

        it('should skip id validation in create mode', () => {
            const result = Validator.checkRule('id', '', { rule: 'required' }, '');
            expect(result).toBe(true); // Skipped
        });

        it('should validate id in update mode', () => {
            const result = Validator.checkRule('id', '', { rule: 'required' }, 'update');
            expect(result).toBe(false); // Validated
        });

        it('should skip id range validation in create mode', () => {
            const result = Validator.checkRule('id', 0, {
                rule: 'range',
                params: { min: 1, max: 1000 }
            }, '');
            expect(result).toBe(true); // Skipped
        });

        it('should validate id range in update mode', () => {
            const result = Validator.checkRule('id', 0, {
                rule: 'range',
                params: { min: 1, max: 1000 }
            }, 'update');
            expect(result).toBe(false); // Validated
        });
    });
});