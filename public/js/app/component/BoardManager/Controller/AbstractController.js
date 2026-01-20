export default class AbstractController {
    constructor(store, view, eventBus, idService, dataType) {
        this.store = store;
        this.view = view;
        this.events = eventBus;
        this.idService = idService;
        this.dataType = dataType;
    }

    setUIState(uiState) {
        this.uiState = uiState;
    }

    modalForm() {
        console.log('modalForm');
        this.events.emit('modal:open:form', {type: this.dataType, payload: {id: 0}});
        this.events.emit('category:reset', {});
        this.events.emit('item:reset', {});
    }

    edit(data) {
        const payload = this.store.normalize(data);
        const obj = this.store.getById(payload.id);
        if (obj) {
            this.events.emit('modal:open:form', {type: this.dataType, payload: obj});
        }
    }

    add(data) {
        data.id = this.idService.next();
        this.store.add(data);
        this.view.render(this.store.all());
    }

    delete(data) {
        const payload = this.store.normalize(data);
        const obj = this.store.getById(payload.id);
        if (obj) {
            this.events.emit('modal:prompt:delete', {type: this.dataType, payload: obj});
        }
    }
}