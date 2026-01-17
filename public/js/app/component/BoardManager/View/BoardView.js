export default class BoardView {
    constructor(wrapper, templateService, templateId) {
        this.wrapper = wrapper;
        this.templateService = templateService;
        this.templateId = templateId;
    }

    render(collection) {
        this.wrapper.innerHTML = '';
        collection.forEach(data => {
            this.wrapper.appendChild(this.createNode(data));
        });
    }

    renderNodeData (data) {
        const node = this.getElementContainer(data.id);
        Object.keys(data).forEach(key => {
            const element = node.querySelector('[data-item-key="' + key + '"]');
            if (!element) return;

            if (/^(input|select|option|textarea)$/i.test(element.tagName)) {
                element.value = data[key];
            } else {
                element.innerText = data[key];
            }
        });
        if (data?.items && data.items.length) {
            this.renderDataItemKeyValue(node, 'items_length', data.items.length);
        }
    }

    renderDataItemKeyValue (node, key, value) {
        const element = node.querySelector('[data-item-key="' + key + '"]');
        if (!element) return;
        element.innerText = value;
    }

    createNode(json) {
        const fragment = this.templateService.clone(this.templateId);

        const node = fragment.querySelector('.content-box-item');
        if (!node) {
            console.warn('content-box-item not found in template');
            return fragment;
        }

        node.dataset.itemId = json.id;

        Object.keys(json).forEach(key => {
            const element = node.querySelector('[data-item-key="' + key + '"]');
            if (!element) return;

            if (/^(input|select|option|textarea)$/i.test(element.tagName)) {
                element.value = json[key];
            } else {
                element.innerText = json[key];
            }
        });
        if (json?.items && json.items.length) {
            this.renderDataItemKeyValue(node, 'items_length', json.items.length);
        }

        return fragment;
    }


    toggleBoxItem (id)
    {
        const elementContainer = this.getElementContainer(id);
        if (elementContainer.classList.contains("show")) {
            elementContainer.classList.remove("show");
            this.setBoxItemDisplay (this.wrapper, "remove", "hidden");
        } else {
            this.setBoxItemDisplay (this.wrapper, "add", "hidden");
            elementContainer.classList.remove("hidden");
            elementContainer.classList.add("show");
        }
    }

    setBoxItemDisplay (wrapperContainer, action, display)
    {
        [...wrapperContainer.querySelectorAll(".content-box-item")].map(item => item.classList[action](display));
    }

    getElementContainer (id) {
        return this.wrapper.querySelector('[data-item-id="' + id + '"]') ?? null;
    }
}
