
export default class StoreFactory {
    constructor(schema) {
        this.schema = schema;
    }

    normalize(data) {
        try {
            const result = {};

            Object.keys(this.schema).forEach(key => {
                if (key in data) {
                    const fieldDefinition = this.schema[key];
                    const type = typeof fieldDefinition === 'object' ? fieldDefinition.type : fieldDefinition;
                    const value = data[key];

                    switch (type) {
                        case 'number':
                            result[key] = value !== null && value !== '' ? Number(value) : null;
                            break;

                        case 'text':
                        case 'string':
                            result[key] = String(value);
                            break;

                        case 'collection':
                        case 'number[]':
                            result[key] = Array.isArray(value)
                                ? value.map(Number)
                                : (value ? [Number(value)] : []);
                            break;

                        case 'string[]':
                            result[key] = Array.isArray(value)
                                ? value.map(String)
                                : (value ? [String(value)] : []);
                            break;

                        default:
                            result[key] = value;
                    }
                }
            });

            return result;
        } catch (e) {
            console.error(`ERROR:StoreFactory:Normalization error in ${data}:`, e);
            throw e;
        }
    }

    sortCatItemsAsc(collection) {
        return [...collection].sort((a, b) => a - b);
    }
}