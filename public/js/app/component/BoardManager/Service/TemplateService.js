export default class TemplateService {
    constructor(templates = {}) {
        this.templates = templates;
    }

    clone(key) {
        if (!this.templates[key]) {
            throw new Error(`Template "${key}" not found`);
        }
        return this.templates[key].content.cloneNode(true);
    }
}
