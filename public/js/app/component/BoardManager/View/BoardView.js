export default class BoardView {
    constructor(wrapper, templateService, templateId) {
        this.container = wrapper.closest('div.itemboard-wrapper');
        this.wrapper = wrapper;
        this.templateService = templateService;
        this.templateId = templateId;
    }

    render(collection) {
        this.wrapper.innerHTML = '';
        collection.forEach(data => {
            this.wrapper.appendChild(this.createNode(data));
        });
        this.renderBoardItemsCount();

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

    renderBoardItemsCount() {
        this.renderDataItemKeyValue(this.container, 'itemBoardLength', this.getChildrenLength());
    }

    displayItemKeyBox(id, show = true)
    {
        const elementContainer = this.container.querySelector('[data-item-key="' + id + '"]');
        if (elementContainer) {
            const act = !show ? "add" : "remove";
            elementContainer.closest('div').classList[act]("d-none");
        }
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
        const el = this.wrapper;
        const rect = el.getBoundingClientRect();
        const isUlVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (el.scrollHeight <= el.clientHeight) {
            return;
        }

        if (!isUlVisible) {
            el.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }

        window.requestAnimationFrame(() => {
            const top = el.scrollHeight;
            if (typeof el.scrollTo === 'function') {
                el.scrollTo({ top, behavior: 'smooth' });
            } else {
                el.scrollTop = top;
            }
        });
    }
    freezeCurrentListHeightAndEnableScroll() {
        const ul = this.wrapper;
        const height = Math.ceil(ul.getBoundingClientRect().height);

        ul.style.maxHeight = `${height}px`;
        ul.style.overflowY = 'auto';
        ul.style.overflowX = 'hidden';
        ul.style.webkitOverflowScrolling = 'touch';

    }

    applyScrollLimitIfNeeded(threshold) {

        threshold = threshold ?? this.getScrollThreshold();

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
        const height = Math.ceil(lastRect.bottom - firstRect.top);

        ul.style.maxHeight = `${height}px`;
        ul.style.overflowY = 'auto';
        ul.style.overflowX = 'hidden';
        ul.style.webkitOverflowScrolling = 'touch';
    }


    getScrollThreshold() {
        const isMobilePortrait = window.matchMedia('(max-width: 767.98px) and (orientation: portrait)').matches;
        return isMobilePortrait ? 4 : 6;
    }
}
