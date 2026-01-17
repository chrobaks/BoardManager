export default class FormFactory {
    constructor(schema, itemStore) {
        this.schema = schema;
        this.itemStore = itemStore;
    }

    categoryForm(data = {}) {
        return this._build('categoryForm', data);
    }

    itemForm(data = {}) {
        return this._build('itemsForm', data);
    }

    _build(key, data) {
        const form = structuredClone(this.schema[key] || []);

        form.forEach(field => {
            if (field.name === 'items') {
                field.options = this.itemStore.all();
                field.selected = data.items ?? [];
            }

            if (data[field.name] !== undefined) {
                field.value = data[field.name];
            }
        });

        return form;
    }
}
