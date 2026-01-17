import Api from './core/Api.js'
import ModalAdapter from './core/ModalAdapter.js'
import BoardManager from './component/BoardManager/BoardManager.js'

document.addEventListener('DOMContentLoaded',  async function () {
    const modalInterface = new ModalAdapter();
    const componentClassList = [
        {obj:BoardManager, depInject: [modalInterface], loadImport: true}
    ];
    if (Api) {
        Api.initComponents(componentClassList);
    } else {
        console.error('APPERROR: Api not found!');
    }
});