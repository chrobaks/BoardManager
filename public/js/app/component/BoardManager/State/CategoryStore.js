import AbstractStore from './AbstractStore.js';

export default class CategoryStore extends AbstractStore {
    constructor(categories = [], typeSchema) {
        super(categories, typeSchema);
    }

    /**
     *
     * @param catIdList
     * @param itemId
     * @returns {void}
     * @throws Error if category isn't found or update failed.
     */
    reinsertItem(catIdList, itemId) {
        try{
            for (const catId of catIdList) {
                const cat = this.getById(catId);
                if (!cat) {
                    throw new Error(`ERROR:CategoryStore:reinsertItem category not found.`);
                }

                cat.items.push(itemId)
                cat.items = this.sortCatItemsAsc(cat.items);
                this.update(cat);
            }
        } catch (e) {
            console.error('ERROR:CategoryStore:reinsertItem',e);
            throw e;
        }
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
