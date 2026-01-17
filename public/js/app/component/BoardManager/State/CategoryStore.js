import AbstractStore from './AbstractStore.js';

export default class CategoryStore extends AbstractStore {
    constructor(categories = [], typeSchema) {
        super(categories, typeSchema);
    }

    removeItemFromAll(itemId) {
        this.collection.forEach(cat => {
            if (!Array.isArray(cat.items)) return;

            if (cat.items.includes(itemId)) {
                this.removeItem(cat, itemId);
            }
        });
    }

    removeItem(category, itemId) {
        category.items = category.items.filter(id => id !== itemId);
    }
}
