// Services
import EventBusService from './Service/EventBusService.js';
import DomEventBinder from './Service/DomEventBinder.js';
import IdService from './Service/IdService.js';
import TemplateService from './Service/TemplateService.js';

// State
import CategoryStore from './State/CategoryStore.js';
import ItemStore from './State/ItemStore.js';
import CommitStore from './State/CommitStore.js';
import UIState from './State/UIState.js';

// View
import BoardView from './View/BoardView.js';
import MessageView from './View/MessageView.js';

// Controller
import CategoryController from './Controller/CategoryController.js';
import ItemController from './Controller/ItemController.js';
import ModalController from './Controller/ModalController.js';

// Factory
import FormFactory from './Factory/FormFactory.js';

export default class BoardManager {
    constructor(container, importData, modal) {
        this.container = container;
        this.importData = importData;
        this.modal = modal;
        this.initServices();
        this.initState();
        this.initView();
        this.initController();
        this.initEventBindings();

    }

    /* -------------------- */
    /* Services             */
    /* -------------------- */
    initServices() {
        this.eventBus = new EventBusService();
        this.categoryIdService = new IdService(this.importData.json.category);
        this.itemIdService = new IdService(this.importData.json.items);
        this.templateService = new TemplateService(this.importData.templates);
    }

    /* -------------------- */
    /* State                */
    /* -------------------- */
    initState() {
        this.categoryStore = new CategoryStore(
            structuredClone(this.importData.json.category || []),
            structuredClone(this.importData.json.typeSchema.category || {})
        );
        this.itemStore = new ItemStore(
            structuredClone(this.importData.json.items || []),
            structuredClone(this.importData.json.typeSchema.items || {})
        );
        this.commitStore = new CommitStore();
        this.uiState = new UIState({
            mode: {
                category: 'board',
                item: 'board'
,            },
            activeId: {
                category: 0,
                item: 0
            }
        });
    }

    /* -------------------- */
    /* View                 */
    /* -------------------- */
    initView() {
        this.categoryView = new BoardView(
            this.container.querySelector('ul.content-box-list.category'),
            this.templateService,
            'categoryTemplate'
        );

        this.itemView = new BoardView(
            this.container.querySelector('ul.content-box-list.items'),
            this.templateService,
            'itemsTemplate'
        );

        this.messageView = new MessageView(
            this.container.querySelector('.container-message')
        );
    }

    /* -------------------- */
    /* Controller           */
    /* -------------------- */
    initController() {

        this.formFactory = new FormFactory(
            this.importData.json,
            this.itemStore
        );
        this.categoryController = new CategoryController(
            this.categoryStore,
            this.categoryView,
            this.eventBus,
            this.categoryIdService
        );
        this.categoryController.setUIState(this.uiState);

        this.itemController = new ItemController(
            this.itemStore,
            this.itemView,
            this.eventBus,
            this.itemIdService
        );
        this.itemController.setUIState(this.uiState);

        this.modalController = new ModalController(
            this.modal,
            this.eventBus,
            this.formFactory
        );

        this.categoryController.init();
        this.itemController.init();
        this.modalController.init();
    }

    initEventBindings() {
        this.domBinder = new DomEventBinder(this.container, this.eventBus);
    }
}
