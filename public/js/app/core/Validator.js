export default class Validator {
    static validate(data, schema, mode = '') {
        const errors = [];
        try {
            for (const [field, rules] of Object.entries(schema)) {
                if (!rules.constraints) continue;

                const value = data[field];

                for (const constraint of rules.constraints) {
                    const isValid = this.checkRule(field, value, constraint, mode);
                    if (!isValid) {
                        errors.push({
                            field: field,
                            message: constraint.message || `Invalid value for ${field}`
                        });
                        break;
                    }
                }
            }
        } catch (e) {
            console.error('Validation failed due to schema or data error:', e);
            errors.push({ field: '_general', message: 'System error during validation.' });
        }
        return errors;
    }

    static checkRule(field, value, constraint, mode) {
        const rule = constraint?.rule ?? null;
        const params = constraint?.params ?? null;
        if (!rule) return true;

        if (mode !== 'update' && field === 'id' && (rule === 'required' || rule === 'range')) {
            return true;
        }

        switch (rule) {
            case 'required':
                return value !== undefined && value !== null && value.toString().trim() !== '';
            case 'min_length':
                if (!params || params.value == null) return true;
                return String(value).length >= params.value;
            case 'max_length':
                if (!params || params.value == null) return true;
                return String(value).length <= params.value;
            case 'range':
                if (!params || params.min == null || params.max == null) return true;
                const val = Number(value);
                return !Number.isNaN(val) && val >= params.min && val <= params.max;
            default:
                return true;
        }
    }
}