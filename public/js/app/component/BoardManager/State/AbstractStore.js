export default class AbstractStore {
    constructor(collection, schema = {}) {
        this.collection = collection;
        this.schema = schema;
    }

    all() {
        return this.collection;
    }

    getById(id) {
        return this.collection.find(c => c.id === id);
    }

    add(category) {
        this.collection.push(this.normalize(category));
    }

    update(update) {
        update = this.normalize(update);
        const data = this.getById(update.id);
        if (data) {
            Object.assign(data, update);
        }
    }

    remove(id) {
        this.collection = this.collection.filter(c => c.id !== id);
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
            console.error(`Normalization error in ${this.constructor.name}:`, e);
            return data;
        }
    }
    currentCount() {
        return this.collection.length ?? 0;
    }
}
