import Utils from '../../../core/Utils.js';
import StoreFactory from '../Factory/StoreFactory.js';

export default class AbstractStore {
    constructor(collection, formType = {}, categoryItemMapStore) {
        this.collection = collection;
        this.formType = formType;
        this.categoryItemMapStore = categoryItemMapStore;
        this.factory = new StoreFactory(formType);
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
                this.collection.push(collectionItem);
            }

            return lengthBefore < this.collection.length;
        } catch (e) {
            console.error('ERROR:AbstractStore:add', e);
        }

        return false;
    }

    addById(obj) {
        const payload = this.normalize(obj.cache);
        const lengthBefore = this.collection.length;

        if (!('id' in payload) || (payload.id ?? null) === null) {
            throw new Error(`ERROR:AbstractStore:addById payload id not found.`);
        }

        const index = this.collection.findIndex(item => item.id > payload.id);
        if (index === -1) {
            this.collection.push(payload);
        } else {
            this.collection.splice(index, 0, payload);
        }

        return lengthBefore < this.collection.length;
    }

    update(update) {
        update = this.factory.normalize(update);
        const data = this.getById(update.id);
        if (!data) {
            throw new Error(`ERROR:AbstractStore Update failed: Item with id ${update.id} not found.`);
        }
        Object.assign(data, update);

        return true;
    }

    remove(id) {
        const collectionLength = this.collection.length;
        const index = this.collection.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error(`ERROR:AbstractStore:remove id not found`);
        }
        this.collection.splice(index, 1);

        return (this.collection.length < collectionLength);
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
