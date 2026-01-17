import AbstractStore from './AbstractStore.js';

export default class ItemStore extends AbstractStore {
    constructor(items = [], typeSchema) {
        super(items, typeSchema);
    }
}
