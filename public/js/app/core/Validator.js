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
        const rule = constraint?.rule ?? null;
        const params = constraint?.params ?? null;
        if (!rule) return true;

        switch (rule) {
            case 'required':
                return value !== undefined && value !== null && value.toString().trim() !== '';
            case 'min_length':
                if (!params || params && !params.value) return true;
                return String(value).length >= params.value;
            case 'max_length':
                if (!params || params && !params.value) return true;
                return String(value).length <= params.value;
            case 'range':
                const val = Number(value);
                if (!params || params && !params.min || params && !params.max) return true;
                return val >= params.min && val <= params.max;
            default:
                return true;
        }
    }
}