import AbstractStore from './AbstractStore.js';

export default class CategoryStore extends AbstractStore {
    constructor(categories = [], typeSchema) {
        super(categories, typeSchema);
    }

    /**
     *
     * @returns {void}
     * @throws Error
     * @param data
     */
    reinsertItem(data) {
        const itemId = data?.payload?.itemId ?? null;
        const revertData = data?.cache ?? null;

        if (itemId === null || revertData === null) {
            throw new Error(`ERROR:CategoryStore:reinsertItem data invalid. itemId: ${itemId}, revertData: ${revertData}.`);
        }

        for (const catId of revertData) {
            const cat = this.getById(catId);
            if (!cat) {
                throw new Error(`ERROR:CategoryStore:reinsertItem category not found.`);
            }

            cat.items.push(itemId)
            cat.items = this.sortCatItemsAsc(cat.items);
            this.update(cat);
        }
    }

    removeItemFromAll(itemId) {
        if ((itemId ?? null) === null) {
            throw new Error(`ERROR:CategoryStore:removeItemFromAll itemId id not found.`);
        }
        const removedIdList = [];

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
