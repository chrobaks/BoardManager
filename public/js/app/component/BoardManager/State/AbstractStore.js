import Utils from '../../../core/Utils.js';

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

    add(obj) {
        this.collection.push(this.normalize(obj));
    }

    addById(obj) {
        try {
            const index = this.collection.findIndex(item => item.id > obj.id);
            if (index === -1) {
                this.collection.push(obj);
            } else {
                this.collection.splice(index, 0, obj);
            }
        } catch (e) {
            console.error('ERROR:AbstractStore:addById', e);
        }
    }

    update(update) {
        try {
            update = this.normalize(update);
            const data = this.getById(update.id);
            if (data) {
                console.log('AbstractStore update', data);
                Object.assign(data, update);
            }

            return true;
        } catch (e) {
            console.error('ERROR:AbstractStore:update', e);
        }

        return false;
    }

    remove(id) {
        this.collection = this.collection.filter(c => c.id !== id);
    }

    sortCatItemsAsc(collection) {
        return [...collection].sort((a, b) => a - b);
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
            console.error(`ERROR:AbstractStore:Normalization error in ${this.constructor.name}:`, e);
            return data;
        }
    }
    currentCount() {
        return this.collection.length ?? 0;
    }

    notEmpty(collection) {
        return (Utils.collectionLength(collection) > 0);
    }
}
