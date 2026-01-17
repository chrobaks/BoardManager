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
        const result = {};

        Object.keys(this.schema).forEach(key => {
            if ((key in data)) {

                const type = this.schema[key];
                const value = data[key];

                switch (type) {
                    case 'number':
                        result[key] = Number(value);
                        break;

                    case 'string':
                        result[key] = String(value);
                        break;

                    case 'number[]':
                        result[key] = Array.isArray(value)
                            ? value.map(Number)
                            : [];
                        break;

                    case 'string[]':
                        result[key] = Array.isArray(value)
                            ? value.map(String)
                            : [];
                        break;

                    default:
                        result[key] = value;
                }
            }
        });

        return result;
    }
}
