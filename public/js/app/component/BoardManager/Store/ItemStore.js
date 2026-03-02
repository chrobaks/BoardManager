import AbstractStore from './AbstractStore.js';

export default class ItemStore extends AbstractStore {
    constructor(items = [], formType, categoryItemMapStore) {
        super(items, formType, categoryItemMapStore);
    }
}
