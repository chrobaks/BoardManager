// Services
import IdService from './Service/IdService.js';
import TemplateService from './Service/TemplateService.js';

// State
import CategoryStore from './State/CategoryStore.js';
import ItemStore from './State/ItemStore.js';
import CommitStore from './State/CommitStore.js';
import UIState from './State/UIState.js';
import CommitState from './State/CommitState.js';

// View
import BoardView from './View/BoardView.js';
import CommitView from './View/CommitView.js';
import MessageView from './View/MessageView.js';

// Controller
import CategoryController from './Controller/CategoryController.js';
import ItemController from './Controller/ItemController.js';
import ModalController from './Controller/ModalController.js';
import CommitController from './Controller/CommitController.js';

// Factory
import FormFactory from './Factory/FormFactory.js';

export const BOARD_EVENT_ACTIONS = {
    SHOW: 'show',
    FORM: 'modal:form',
    EDIT: 'edit',
    DELETE: 'delete'
};

export default class BoardManager {

    /**
     * @param {HTMLElement} container
     * @param {Object} importData
     * @param {ModalAdapter} modal
     * @param {EventBus} eventBus
     * @param {DomEventManager} domManager
     */
    constructor(container, importData, modal, eventBus, domManager) {
        this.container = container;
        this.importData = importData;
        this.modal = modal;
        this.eventBus = eventBus;
        this.domManager = domManager;

        this.init();
    }

    init() {
        this.initServices();
        this.initState();
        this.initView();
        this.initController();
    }

    /* -------------------- */
    /* Services             */
    /* -------------------- */
    initServices() {
        // this.eventBus = new EventBusService();
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
            structuredClone(this.importData.json.formType.category || {})
        );
        this.itemStore = new ItemStore(
            structuredClone(this.importData.json.items || []),
            structuredClone(this.importData.json.formType.item || {})
        );
        this.commitStore = new CommitStore();
        this.commitState = new CommitState();
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

        this.commitView = new CommitView(
            this.container.querySelector('.commit-wrapper'),
            this.templateService,
        );

        this.messageView = new MessageView(
            this.container.querySelector('.component-msg')
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

        this.commitController = new CommitController(
            this.commitStore,
            this.commitView,
            this.commitState,
            this.container,
            this.eventBus
        );

        this.categoryController.init();
        this.itemController.init();
        this.modalController.init();
        this.commitController.init();

        this.eventBus.on('message:show', (payload) => {
            this.messageView.show(payload.text, payload.type);
        });
    }
}
