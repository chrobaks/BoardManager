import Api from './core/Api.js'
import ModalAdapter from './core/ModalAdapter.js'
import EventBus from './core/EventBus.js';
import DomEventManager from './core/DomEventManager.js';
import BoardManager from './component/BoardManager/BoardManager.js'

document.addEventListener('DOMContentLoaded',  async function () {
    const sharedEventBus = new EventBus();
    const sharedModal = new ModalAdapter();
    const componentClassList = [
        {
            obj:BoardManager,
            loadImport: true,
            dependencies: (container, importData) => [
                container,                              // constructor arg 1
                importData,                             // constructor arg 2
                sharedModal,                            // constructor arg 3
                sharedEventBus,                         // constructor arg 4
                new DomEventManager(container, sharedEventBus) // constructor arg 5
            ]
        }
    ];
    if (Api) {
        Api.initComponents(componentClassList);
    } else {
        console.error('APPERROR: Api not found!');
    }
});