export default class Validator {
    static validate(data, schema) {
        const errors = [];
        try {
            for (const [field, rules] of Object.entries(schema)) {
                if (!rules.constraints) continue;

                const value = data[field];

                for (const constraint of rules.constraints) {
                    const isValid = this.checkRule(value, constraint);
                    if (!isValid) {
                        errors.push({
                            field: field,
                            message: constraint.message || `Invalid value for ${field}`
                        });
                        break; // Nur den ersten Fehler pro Feld anzeigen
                    }
                }
            }
        } catch (e) {
            console.error('Validation failed due to schema or data error:', e);
            errors.push({ field: '_general', message: 'System error during validation.' });
        }
        return errors;
    }

    static checkRule(value, constraint) {
        switch (constraint.rule) {
            case 'required':
                return value !== undefined && value !== null && value.toString().trim() !== '';
            case 'min_length':
                return String(value).length >= constraint.params.value;
            case 'range':
                const val = Number(value);
                return val >= constraint.params.min && val <= constraint.params.max;
            default:
                return true;
        }
    }
}