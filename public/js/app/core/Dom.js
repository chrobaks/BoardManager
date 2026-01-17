export default class Dom {
    static render(config, parent) {
        for (const item of config) {
            const element = document.createElement(item.tag);

            if (item.selectorAttr === "class") {
                const classes = Array.isArray(item.selector) ? item.selector : [item.selector];
                element.classList.add(...classes);
            } else if (item.selectorAttr) {
                element.setAttribute(item.selectorAttr, item.selector);
            }

            if (item.textNode) {
                element.textContent = item.textNode;
            }

            if (item.childNodes) {
                this.render(item.childNodes, element);
            }

            parent.append(element);
        }
    }

    static scrollToFinished(y) {
        return new Promise(resolve => {
            const check = () => {
                if ((window.scrollY || document.documentElement.scrollTop) >= y) {
                    resolve();
                } else {
                    window.requestAnimationFrame(check);
                }
            };
            check();
        });
    }
}