export default class Api
{
    static initComponents(componentClassList) {
        const componentContainerList = document.querySelectorAll('[data-component]');

        if (componentContainerList.length) {
            (async () => {
                for (const el of [...componentContainerList]) {
                    const componentName = el.dataset.component?.trim();
                    if (!componentName) continue;

                    const componentObj = Api.getComponentObject(componentName, componentClassList);
                    if (!componentObj) continue;

                    try {
                        const { componentDef } = componentObj;

                        const importData = componentDef.loadImport
                            ? await Api.getImport(el, componentName)
                            : { json: {}, templates: {} };

                        let constructorArgs = [];

                        if (typeof componentDef.dependencies === 'function') {
                            constructorArgs = componentDef.dependencies(el, importData);
                        } else {
                            constructorArgs = [el, importData, ...(componentDef.depInject || [])];
                        }

                        new componentDef.obj(...constructorArgs);

                    } catch (e) {
                        console.error(`Failed to initialize component "${componentName}"`, e, el);
                    }
                }
            })();
        }
    }

    static getComponentObject (componentName, componentClassList)
    {
        if (!componentName) {
            return null;
        }
        const componentDef = componentClassList.find(def =>
            def.obj?.name === componentName
        );
        if (!componentDef) {
            console.warn(`Component "${componentName}" not registered`);
            return null;
        }

        return {componentName: componentName, componentDef: componentDef};
    }

    static async getImport (container, dataId)
    {
        const data = await Api.getImportJs(container, dataId);
        return {
            json : data,
            templates : Api.getImportTemplates(container, dataId),
        }
    }

    static async getImportJs(container, dataSourceId) {
        const script = container.querySelector(
            `script[data-source="${dataSourceId}"]`
        );

        if (!script) {
            return null;
        }

        if (script.textContent?.trim()) {
            return JSON.parse(script.textContent);
        }

        if (script.src) {
            const response = await fetch(script.src);
            return await response.json();
        }

        return null;
    }

    static getImportTemplates (container, dataTemplateIdId)
    {
        const templateImport = container.querySelectorAll('template[data-source="' + dataTemplateIdId + '"]');
        let result = {};
        if (templateImport?.length) {
            [...templateImport].map(tpl => {
                const id = tpl?.dataset?.template;
                if (id) {
                    result[id] = tpl;
                }
            });
        }

        return result;
    }
}
