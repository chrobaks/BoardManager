import AbstractView from "./AbstractView.js";
import BoardViewFactory from '../Factory/BoardViewFactory.js';

export default class BoardView extends AbstractView {
    constructor(wrapper, templateService, templateId) {
        try {
            super(wrapper.closest('div.itemboard-wrapper'), wrapper, templateService);
            this.templateId = templateId;
            this.factory = new BoardViewFactory(this.templateService);
        } catch (e) {
            console.error('ERROR:BoardView:constructor', e);
        }
    }

    firstCharUpperCase(str, formateToLowerCase = true) {
        return this.factory.firstCharUpperCase(str, formateToLowerCase);
    }

    render(collection) {
        try {
            this.wrapper.innerHTML = '';
            collection.forEach(data => {
                this.wrapper.appendChild(this.createNode(data));
            });
            this.renderBoardItemsCount();
        } catch (e) {
            console.error('ERROR:BoardView:render', e);
        }
    }

    renderNodeData (data) {
        try {
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
        } catch (e) {
            console.error('ERROR:BoardView:renderNodeData', e);
            throw e;
        }
    }

    renderDataItemKeyValue (node, key, value) {
        try {
            const element = node.querySelector('[data-item-key="' + key + '"]');
            if (!element) return;
            element.innerText = value;
        } catch (e) {
            console.error('ERROR:BoardView:renderDataItemKeyValue', e);
        }
    }

    renderBoardItemsCount() {
        try {
            this.renderDataItemKeyValue(this.container, 'itemBoardLength', this.getChildrenLength());
        } catch (e) {
            console.error('ERROR:BoardView:renderBoardItemsCount', e);
        }
    }

    displayItemKeyBox(id, show = true)
    {
        try {
            const elementContainer = this.container.querySelector('[data-item-key="' + id + '"]');
            if (elementContainer) {
                const act = !show ? "add" : "remove";
                elementContainer.closest('div').classList[act]("d-none");
            }
        } catch (e) {
            console.error('ERROR:BoardView:displayItemKeyBox', e);
        }
    }

    createNode(json) {
        try {
            const {fragment, node} = this.factory.createNode(this.templateId, json);
            if (json?.items && json.items.length) {
                this.renderDataItemKeyValue(node, 'items_length', json.items.length);
            }

            return fragment;
        } catch (e) {
            console.error('ERROR:BoardView:createNode', e);
        }

        return null;
    }


    toggleBoxItem (id)
    {
        try {
            const elementContainer = this.getElementContainer(id);
            if (elementContainer.classList.contains("show")) {
                elementContainer.classList.remove("show");
                this.setBoxItemDisplay(this.wrapper, "remove", "hidden");
            } else {
                this.setBoxItemDisplay(this.wrapper, "add", "hidden");
                elementContainer.classList.remove("hidden");
                elementContainer.classList.add("show");
            }
        } catch (e) {
            console.error('ERROR:BoardView:toggleBoxItem', e);
        }
    }

    setBoxItemDisplay (wrapperContainer, action, display)
    {
        [...wrapperContainer.querySelectorAll(".content-box-item")].map(item => item.classList[action](display));
    }

    getElementContainer (id) {
        return this.wrapper.querySelector('[data-item-id="' + id + '"]') ?? null;
    }

    getItemElements() {
        return Array.from(this.wrapper.children).filter(el => el.tagName === 'LI');
    }

    getChildrenLength() {
        return this.getItemElements().length;
    }

    getFirstChildNode() {
        return this.getItemElements()[0] ?? null;
    }

    getChildAt(index) {
        const items = this.getItemElements();
        return items[index] ?? null;
    }

    scrollIntoView() {
        try {
            const el = this.wrapper;
            const rect = el.getBoundingClientRect();
            const isUlVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (el.scrollHeight <= el.clientHeight) {
                return;
            }

            if (!isUlVisible) {
                el.scrollIntoView({block: 'start', behavior: 'smooth'});
            }

            window.requestAnimationFrame(() => {
                const top = el.scrollHeight;
                if (typeof el.scrollTo === 'function') {
                    el.scrollTo({top, behavior: 'smooth'});
                } else {
                    el.scrollTop = top;
                }
            });
        } catch (e) {
            console.error('ERROR:BoardView:scrollIntoView', e);
        }
    }

    applyScrollLimitIfNeeded() {
        try {
            const threshold= this.getScrollThreshold();

            const ul = this.wrapper;
            const count = this.getChildrenLength();

            if (count <= threshold) {
                ul.style.maxHeight = '';
                ul.style.overflowY = '';
                ul.style.overflowX = '';
                ul.style.webkitOverflowScrolling = '';
                return;
            }

            const first = this.getFirstChildNode();
            const last = this.getChildAt(threshold - 1);
            if (!first || !last) return;

            const firstRect = first.getBoundingClientRect();
            const lastRect = last.getBoundingClientRect();
            let height = Math.ceil(lastRect.bottom - firstRect.top);

            if (first.offsetHeight) {
                height = height + (first.offsetHeight / 2);
            }

            ul.style.maxHeight = `${height}px`;
            ul.style.overflowY = 'auto';
            ul.style.overflowX = 'hidden';
            ul.style.webkitOverflowScrolling = 'touch';
        } catch (e) {
            console.error('ERROR:BoardView:applyScrollLimitIfNeeded', e);
        }
    }


    getScrollThreshold() {
        const isMobilePortrait = window.matchMedia('(max-width: 767.98px) and (orientation: portrait)').matches;
        return isMobilePortrait ? 4 : 6;
    }
}
