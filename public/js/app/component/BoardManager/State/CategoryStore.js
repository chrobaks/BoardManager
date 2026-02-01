import AbstractStore from './AbstractStore.js';

export default class CategoryStore extends AbstractStore {
    constructor(categories = [], typeSchema) {
        super(categories, typeSchema);
    }

    removeItemFromAll(itemId) {
        const removedIdList = [];
        if (!itemId) return removedIdList;
        this.collection.forEach(cat => {
            if (!Array.isArray(cat.items)) return;

            if (cat.items.includes(itemId)) {
                this.removeItem(cat, itemId);
                removedIdList.push(cat.id);
            }
        });

        return removedIdList;
    }

    removeItem(category, itemId) {
        category.items = category.items.filter(id => id !== itemId);
    }
}
