import Utils from '../../../core/Utils.js';
import StoreFactory from '../Factory/StoreFactory.js';

export default class AbstractStore {
    constructor(collection, schema = {}) {
        this.collection = collection;
        this.schema = schema;
        this.factory = new StoreFactory(schema);
    }

    all() {
        return this.collection;
    }

    getById(id) {
        return this.collection.find(c => c.id === id);
    }

    add(obj) {
        try {
            const lengthBefore = this.collection.length;
            const collectionItem = this.factory.normalize(obj);
            if (Object.keys(collectionItem).length) {
                this.collection.push(this.factory.normalize(obj));
            }

            return lengthBefore < this.collection.length;
        } catch (e) {
            console.error('ERROR:AbstractStore:add', e);
        }

        return false;
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
            update = this.factory.normalize(update);
            const data = this.getById(update.id);
            if (data) {
                Object.assign(data, update);

                return true;
            }
        } catch (e) {
            console.error('ERROR:AbstractStore:update', e);
        }

        return false;
    }

    remove(id) {
        const collectionLength = this.collection.length;
        this.collection = this.collection.filter(c => c.id !== id);

        return (this.collection.length < collectionLength);
    }

    sortCatItemsAsc(collection) {
        return [...collection].sort((a, b) => a - b);
    }

    normalize(data) {
        return this.factory.normalize(data);
    }
    currentCount() {
        return this.collection.length ?? 0;
    }

    notEmpty(collection) {
        return (Utils.collectionLength(collection) > 0);
    }
}
