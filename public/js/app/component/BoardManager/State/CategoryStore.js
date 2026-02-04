import AbstractStore from './AbstractStore.js';

export default class CategoryStore extends AbstractStore {
    constructor(categories = [], typeSchema) {
        super(categories, typeSchema);
    }

    /**
     *
     * @param catIdList
     * @param itemId
     * @returns {boolean}
     */
    reinsertItem(catIdList, itemId) {
        try{
            catIdList.forEach((catId) => {
                const cat = this.getById(catId);
                if (cat) {
                    cat.items.push(itemId)
                    cat.items = this.sortCatItemsAsc(cat.items);
                    this.update(cat);
                }
            });
            return true;
        } catch (e) {
            console.error('ERROR:CategoryStore:reinsertItem',e);
        }

        return false;
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
