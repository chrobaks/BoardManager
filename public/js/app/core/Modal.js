
import Form from './Form.js'
import Dom from './Dom.js'

export default class Modal
{
    domConf = [{
        selector : "gridModal", selectorAttr : "id", tag: "div",
        childNodes : [
            {selector : "grid-modal-bg", selectorAttr : "id", tag: "div"},
            {selector : "grid-modal-container", selectorAttr : "id", tag: "div", childNodes : [
                    {selector : ["grid-modal-head"], selectorAttr : "class", tag: "div", childNodes : [{selector : ["title"], selectorAttr : "class", tag: "span"}]},
                    {selector : ["grid-modal-body"], selectorAttr : "class", tag: "div"},
                    {selector : ["grid-modal-footer"], selectorAttr : "class", tag: "div", childNodes : [
                            {selector : ["btn","btn-primary","btn-sm","m-1", "save"], selectorAttr : "class", tag: "button", textNode : "Save data"},
                            {selector : ["btn","btn-secondary","btn-sm","m-1", "close"], selectorAttr : "class", tag: "button", textNode : "Close"},
                        ]},
                ]},
        ]
    }];

    constructor ()
    {
        Dom.render([...this.domConf], document.body);

        this.modal = document.getElementById('gridModal');
        this.modalBg = document.getElementById('grid-modal-bg');
        this.modalContainer = document.getElementById('grid-modal-container');
        this.modalHead = this.modal.querySelector('.grid-modal-head');
        this.modalBody = this.modal.querySelector('.grid-modal-body');
        this.modalFooter = this.modal.querySelector('.grid-modal-footer');
        this.modalType = "save";
        this.modalOption = {};

        this.initEvents();
    }

    initEvents() {
        this.modal.querySelector('button.close').onclick = () => this.close();
        this.modalBg.onclick = () => this.close();

        this.modal.querySelector('button.save').onclick = async () => {
            if (typeof this.modalOption?.onSubmit === 'function') {
                const canClose = await this.modalOption.onSubmit();
                if (canClose !== false) {
                    this.close();
                }
            }
        };
    }

    close() {
        this.display(false);
    }

    display ()
    {
        this.modal.style.display = (this.modal.style.display === 'inline-block') ? 'none' : 'inline-block';

        if (this.modal.style.display === 'inline-block') {
            document.body.classList.add('no-scroll');
            this.modalBg.style.height = window.innerHeight + "px";
            this.modalBg.style.top = window.scrollY + "px";
            this.modalContainer.style.top = (100 + window.scrollY) + "px";

            [...this.modal.querySelectorAll('button')].map((btn) => {
                btn.style.display = 'block';
            });
        } else {
            document.body.classList.remove('no-scroll');
        }
    }

    setTitle (strTitle)
    {
        let title = '';
        if (typeof strTitle === 'string') {
            title = (strTitle.length > 150) ? strTitle.slice(0, 150) : strTitle;
        }
        this.modalHead.querySelector('.title').innerText = title;
    }

    renderButtons ()
    {
        switch (this.modalType) {
            case 'prompt':
                this.modal.querySelector('button.save').innerHTML = "Delete data";
                this.modal.querySelector('button.close').innerHTML = "Cancel";
                break;
            default:
                this.modal.querySelector('button.save').innerHTML = "Save data";
                this.modal.querySelector('button.close').innerHTML = "Close";
                break;
        }
    }

    renderBody (response, modalOption = {})
    {
        this.modalBody.innerHTML = response;
        this.modalOption = {...this.modalOption, ...modalOption};
        this.display();
    }
}