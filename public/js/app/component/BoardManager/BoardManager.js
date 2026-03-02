// Services
import IdService from './Service/IdService.js';
import TemplateService from './Service/TemplateService.js';

// Store
import CategoryStore from './Store/CategoryStore.js';
import ItemStore from './Store/ItemStore.js';
import CategoryItemMapStore from './Store/CategoryItemMapStore.js';
import CommitStore from './Store/CommitStore.js';

// State
import BoardState from './State/BoardState.js';
import CommitState from './State/CommitState.js';

// View
import BoardView from './View/BoardView.js';
import CommitView from './View/CommitView.js';

// Controller
import CategoryController from './Controller/CategoryController.js';
import ItemController from './Controller/ItemController.js';
import ModalController from './Controller/ModalController.js';
import CommitController from './Controller/CommitController.js';

// Factory
import FormFactory from './Factory/FormFactory.js';

export const BOARD_EVENT_ACTIONS = {
    'board': {
        SHOW: 'show',
        FORM: 'modal:form',
        EDIT: 'edit',
        DELETE: 'delete'
    },
    'commit': {
        SHOW_COMMITS: 'show:commits',
        EXEC_UNDO: 'exec:undo',
        SUBMIT_COMMITS: 'submit:commits',
    }
};

export const SUPPORTED_EVENTS = ['click', 'input', 'change', 'submit', 'mouseover', 'mouseleave', 'keyup'];

export default class BoardManager {

    /**
     * @param {HTMLElement} container
     * @param {Object} importData
     * @param {ModalAdapter} modal
     * @param {EventBus} eventBus
     * @param {DomEventManager} domEventManager
     */
    constructor(container, importData, modal, eventBus, domEventManager) {
        this.container = container;
        this.importData = importData;
        this.modal = modal;
        this.eventBus = eventBus;
        this.domEventManager = domEventManager;

        this.init();
    }

    init() {
        this.initServices();
        this.initState();
        this.initStore();
        this.initView();
        this.initController();
    }

    /* -------------------- */
    /* Services             */
    /* -------------------- */
    initServices() {
        this.categoryIdService = new IdService(this.importData.json.category);
        this.itemIdService = new IdService(this.importData.json.items);
        this.templateService = new TemplateService(this.importData.templates);
    }

    /* -------------------- */
    /* State                */
    /* -------------------- */
    initState() {
        this.commitState = new CommitState();
        this.boardState = new BoardState({
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
    /* Store                */
    /* -------------------- */
    initStore() {
        this.categoryItemMapStore = new CategoryItemMapStore(
            structuredClone(this.importData.json.categoryItemMap || []),
            structuredClone(this.importData.json.formType.categoryItemMap || {})
        );
        this.categoryStore = new CategoryStore(
            structuredClone(this.importData.json.category || []),
            structuredClone(this.importData.json.formType.category || {}),
            this.categoryItemMapStore
        );
        this.itemStore = new ItemStore(
            structuredClone(this.importData.json.items || []),
            structuredClone(this.importData.json.formType.item || {}),
            this.categoryItemMapStore
        );

        this.commitStore = new CommitStore();
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
            this.categoryIdService,
            this.boardState
        );

        this.itemController = new ItemController(
            this.itemStore,
            this.itemView,
            this.eventBus,
            this.itemIdService,
            this.boardState
        );

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

        this.modalController.init();
        this.commitController.init();
    }
}
