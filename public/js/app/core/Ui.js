/**
 *-------------------------------------------
 * Ui.js
 *-------------------------------------------
 * @version 1.1.0
 * @createAt 17.06.2020 17:30
 * @updatedAt 14.05.2023 00:25
 * @author NetCoDev
 *-------------------------------------------
 **/
export default class Ui
{
    static checkFormValidation (list)
    {
        const result = [];
        list.map(obj => {
            const value = obj.value.trim();
            if (Ui.dataSetValue(obj, "required") || obj.hasAttribute("required")) {
                if (value === '') {
                    result.push(obj.title);
                }
            }
        });

        return result;
    }

    static checkScrollEnd (y, statusObj) {
        if ((window.scrollY || document.body.scrollTop || document.documentElement.scrollTop) < y) {
            window.requestAnimationFrame(() => {Ui.checkScrollEnd(y, statusObj)});
        } else {
            statusObj.status = 0;
        }
    }

    static formList (container)
    {
        return [
            ...container.querySelectorAll("input"),
            ...container.querySelectorAll("select"),
            ...container.querySelectorAll("textarea"),
        ];
    }

    static formListToData (formList)
    {
        const formData = new FormData();
        const emptyKeys = [];

        if (formList.length) {
            formList.map((elmn) => {

                formData.append(elmn.name, elmn.value.trim());
                
                if (elmn.value === "") {
                    emptyKeys.push(elmn.name);
                }
            });
        }

        return {formData : formData, emptyKeys : emptyKeys};
    }

    static formData (arrArgs)
    {
        const formData = new FormData();

        for (let e in arrArgs) {
            formData.append(e, arrArgs[e]);
        }

        return formData;
    }

    static formPostList (formList)
    {
        let result = [];
        formList.map($element => {
            if ($element.tagName.toLowerCase() === "select") {
                result[$element.name] = [...$element.options]
                    .filter(option => option.selected)
                    .map(option => option.value);
            } else {
                result[$element.name] = $element.value.trim()
            }
        });
        return result;
    }

    static formPostData (arrArgs)
    {
        const formData = this.formData(arrArgs);
        return Array
            .from(formData.entries())
            .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {});
    }

    static dataSetValue (obj, key)
    {
        return (obj.dataset?.[key]) ? obj.dataset[key] : '';
    }

    static getIndex (container, selector, obj)
    {
        const list = Array.prototype.slice.call( container.querySelectorAll(selector) );

        return list.indexOf(obj);
    }

    static getJsonFromStr (key, str)
    {
        let result = null;

        try {
            const jsonObj = JSON.parse(str);

            if (typeof jsonObj === 'object' && jsonObj.hasOwnProperty(key)) {result = jsonObj.key;}
        }
        catch(err) {
            if (err && err.message.length) {
                result = null;
            }
        }

        return result;
    }

    static listHasUniqueValue (list, value, limit)
    {
        let count = 0;

        list.map(obj => {
            if (obj.value === value) {
                count++;
            }
        });

        return (count <= limit);
    }

    static renderDom (conf, parent)
    {
        conf.map((obj) => {

            const element = document.createElement(obj.tag);

            if (obj.selectorAttr === "class") {
                element.classList.add(...obj.selector);
            } else {
                element.setAttribute(obj.selectorAttr, obj.selector);
            }

            if (obj.hasOwnProperty("textNode")) {
                element.append(obj.textNode)
            }

            if (obj.hasOwnProperty("childNodes")) {
                Ui.renderDom(obj.childNodes, element);
            }

            parent.append(element);
        });
    }
}