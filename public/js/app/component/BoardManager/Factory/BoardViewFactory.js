
export default class BoardViewFactory {
    constructor(templateService) {
        this.templateService = templateService;
    }

    createNode(templateId, json) {
        const build = {fragment: null, node: null};
        try {
            const fragment = this.templateService.clone(templateId);

            const node = fragment.querySelector('.content-box-item');
            if (!node) {
                console.warn('content-box-item not found in template');
                return build;
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

            return {fragment: fragment, node: node};
        } catch (e) {
            console.error('ERROR:BoardViewFactory:createNode', e);
        }

        return build;
    }
}
