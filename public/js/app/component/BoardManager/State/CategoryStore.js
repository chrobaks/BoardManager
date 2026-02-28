import AbstractStore from './AbstractStore.js';

export default class CategoryStore extends AbstractStore {
    constructor(categories = [], formType, categoryItemMapStore) {
        super(categories, formType, categoryItemMapStore);
    }

    all() {
        return this.collection.map(cat => {
            return {
                ... cat,
                items: this.categoryItemMapStore.getItemsByCategory(cat.id)
            }
        });
    }

    add(obj) {
        try {
            const payload = this.factory.normalize(obj);
            const { items, ...categoryData } = payload;

            if (super.add(categoryData)) {
                if (Array.isArray(items) && items.length > 0) {
                    this.categoryItemMapStore.setCategoryItems(payload);
                }

                return true;
            }
        } catch (e) {
            console.error('ERROR:AbstractStore:add', e);
        }

        return false;
    }

    addById(obj) {
        const payload = this.factory.normalize(obj.cache);
        const { items, ...categoryData } = payload;

        if (super.addById({ cache: categoryData })) {
            if (Array.isArray(items) && items.length > 0) {
                this.categoryItemMapStore.setCategoryItems(payload);
            }
        }
    }

    getById(id) {
        const cat =  super.getById(id);
        if (!cat?.id) {
            throw new Error(`ERROR:CategoryStore:getById category not found.`);
        }

        return {
            ... cat,
            items: this.categoryItemMapStore.getItemsByCategory(cat.id)
        }
    }

    update(updateData) {
        const payload = this.factory.normalize(updateData);

        if (Array.isArray(payload.items)) {
            this.categoryItemMapStore.setCategoryItems(payload);

            delete payload.items;
        }

        return super.update(payload);
    }

    remove(id) {
        if (super.remove(id)) {
            this.categoryItemMapStore.deleteCategory(id);

            return true;
        }

        return false;
    }

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
            cat.items = this.factory.sortCatItemsAsc(cat.items);
            this.update(cat);
        }
    }

    removeItemFromAll(itemId) {
        if ((itemId ?? null) === null) {
            throw new Error(`ERROR:CategoryStore:removeItemFromAll itemId id not found.`);
        }
        const removedIdList = [];

        this.collection.forEach(cat => {
            if (this.categoryItemMapStore.hasItemInCategory(cat.id, itemId)) {
                this.categoryItemMapStore.deleteItemFromCategory(cat.id, itemId);
                removedIdList.push(cat.id);
            }
        });

        return removedIdList;
    }

    removeItem(category, itemId) {
        this.categoryItemMapStore.deleteItemFromCategory(category.id, itemId);
    }
}
