import StoreFactory from '../Factory/StoreFactory.js';

export default class CategoryItemMapStore {
    constructor(categoryItemMap = [], formType) {
        this.categoryItemMap = categoryItemMap;
        this.formType = formType;
        this.byCategory = new Map();
        this.factory = new StoreFactory(formType);

        this.init();
    }

    init() {
        this.categoryItemMap.forEach(entry => {
            this.add(entry.category_id, entry.item_id);
        });
    }

    add(category_id, item_id) {
        if (!this.byCategory.has(category_id)) {
            this.byCategory.set(category_id, new Set());
        }
        this.byCategory.get(category_id).add(item_id);
    }

    getItemsByCategory(category_id) {
        const set = this.byCategory.get(category_id);
        if (!set || set.size < 1) return [];
        return Array.from(set);
    }

    setCategoryItems(payload) {
        if (!payload.id) return;

        const currentItems = this.factory.sortCatItemsAsc(this.getItemsByCategory(payload.id));
        const newItems = this.factory.sortCatItemsAsc(payload.items);

        if (!this.hasChanged(currentItems, newItems)) {
            return;
        }

        this.resetEntriesByCategoryId(payload.id);
        this.setEntriesByCategory(payload.id, newItems);
    }

    setEntriesByCategory(catId, newItems) {
        if (!this.byCategory.has(catId)) {
            this.byCategory.set(catId, new Set());
        }
        const set = this.byCategory.get(catId);

        newItems.forEach(itemId => {
            set.add(itemId);
        });
    }

    resetEntriesByCategoryId(catId) {
        if (!this.byCategory.has(catId)) {
            this.byCategory.set(catId, new Set());
            return;
        }
        this.byCategory.get(catId).clear();
    }

    deleteItemFromCategory(catId, itemId) {
        const set = this.byCategory.get(catId);
        if (!set || set.size === 0) return;

        const removed = set.delete(itemId);
        if (!removed) return;

        if (set.size === 0) {
            this.byCategory.delete(catId);
        }

    }

    deleteCategory(catId) {
        this.byCategory.delete(catId);
    }

    hasItemInCategory(category_id, item_id) {
        const set = this.byCategory.get(category_id);
        return !!set && set.has(item_id);
    }

    hasChanged(currentItems, newItems) {
        return !(currentItems.length === newItems.length
            && currentItems.every((id, index) => id === newItems[index]));
    }

    toList(getSorted = false) {
        return getSorted ? this.toListSorted() : this.toListUnsorted();
    }

    toListUnsorted() {
        const result = [];

        this.byCategory.forEach((set, category_id) => {
            for (const item_id of set) {
                result.push({ category_id, item_id });
            }
        });

        return result;
    }

    toListSorted() {
        const categories = this.factory.sortCatItemsAsc(this.byCategory.keys());
        const result = [];

        for (const category_id of categories) {
            const items = this.factory.sortCatItemsAsc(this.byCategory.get(category_id) ?? []);
            for (const item_id of items) {
                result.push({ category_id, item_id });
            }
        }

        return result;
    }
}