export default class ItemView {
    constructor(wrapper, templateService) {
        this.wrapper = wrapper;
        this.templateService = templateService;
    }

    render(items) {
        this.wrapper.innerHTML = '';
        items.forEach(item => {
            this.wrapper.appendChild(this.createNode(item));
        });
    }

    createNode(json) {
        const node = this.templateService.clone('itemsTemplate');

        Object.keys(json).forEach(key =>
        {
            const element = node.querySelector('[data-item-key="' + key + '"]');

            if (element) {
                if (/^(input|select|option|textarea)$/.test(element.tagName.toLowerCase())) {
                    element.value = json[key];
                } else {
                    element.innerText = json[key];
                }
            }
        });

        return node;
    }
}
