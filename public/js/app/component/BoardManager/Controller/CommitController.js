
import AbstractController from './AbstractController.js';
import CommitFactory from '../Factory/CommitFactory.js';
import CommitService from '../Service/CommitService.js';

export default class CommitController extends AbstractController {
    /**
     * @param {CommitStore} store
     * @param {CommitView} view
     * @param {CommitState} commitState
     * @param {HTMLElement} container
     * @param {EventBus} eventBus
     */
    constructor(store, view, commitState, container, eventBus) {
        super(store, view, eventBus, null, null, 'commit');
        this.commitState = commitState;
        this.container = container;
        this.service = new CommitService(
            this.store,
            this.view,
            this.events,
            new CommitFactory({
                'delete': 'revert:delete',
                'deleteItemFromAll': 'revert:item',
                'deleteItemFromCategory': 'revert:item',
                'update': 'revert:update',
                'add': 'revert:add',
                'reset': 'reset',
            })
        );
    }

    init() {
        this.view.init();
        this.commitState.setAutoEnabled(this.view.autoCommitSwitchIsChecked());
        this.view.showCommitCtrl(false);
        this.initEvents([
            {action:'auto:commit', eventName: 'change'},
            {action:'undo', eventName: 'change'},
            {action:'undo:all', eventName: 'change'},
            {action:'add'},
            {action:'remove'},
            {action:'reverted'},
            {action:'message:show'},
        ]);
        if (this.view.isMobile()) {
            this.setMessage({text: `Commit controls loaded`, type: 'info'});
        }
    }

    remove() {
        const undoIndexList = this.view.getUndoCommitList();

        if (undoIndexList.length === 0) return;

        if (this.store.setRevertList(undoIndexList)) {
           this.reverted(0);
        }
    }

    reverted(index) {
        if (index < this.store.revertList.length) {
            this.service.handleCommitRevert(index);
        } else {
            this.service.handleRevertFinished();
            this.setMessage({text: `Reverted all selected changes.`, type: 'success'});
        }
    }

    execUndo () {
        this.events.emit('modal:prompt:delete', {
            type: this.dataType,
            payload: {},
            msg:'Warning!!! All marked commits will be reverted. This will also change the current data! Do you want to continue?'
        });
    }

    undo () {
        this.view.changeDeleteAllSwitchCheck(false);
        this.view.renderActiveCommitItem();
    }
    undoAll (payload) {
        this.view.changeUndoCommitSwitch(payload.targetElement.checked);
        this.view.renderActiveCommitItem();
    }

    messageShow(payload) {
        this.view.showMessage(payload);
    }

    showCommits () {
        this.service.displayCommitList();
    }

    autoCommit(payload) {
        this.view.showAlertBoard(false);
        if (!this.commitState.autoIsEnabled() && this.store.length() > 0) {
            payload.targetElement.checked = false;
            this.view.showAlertBoard(true);
            globalThis.setTimeout(() => this.view.showAlertBoard(false), 5000);
        } else {
            this.commitState.toggleAutoEnabled();
            this.view.showCommitCtrl(this.store.hasCommits());
        }
    }

    add(payload) {
        this.view.showAlertBoard(false);

        if (this.view.autoCommitSwitchIsChecked()) {
            this.view.showListBoard(false);
            this.submitPayload(payload);
            return;
        }
        if (!this.service.updateListBoard(payload)) return;

        this.setMessage({text: `New ${payload.action} commit successfully created`, type: 'success'});
    }

    async submitCommits() {
        const commits = this.store.all();
        if (commits.length === 0) return;

        try {
            await this.service.execSubmit(commits);
            this.service.updateCommitBoard();
            this.setMessage({text: `Request successfully submitted!`, type: 'success'});

        } catch (error) {
            console.error('ERROR:CommitController:submitCommits', error);
            this.setMessage({text: `Commit Request failed!`, type: 'danger'});
        }
    }

    async submitPayload(payload) {
        const dataType = payload?.type ?? null;
        try {
            if (!dataType) {
                throw new Error(`Error: dataType is not set. Please set it in the board settings.`);
            }

            await this.service.execSubmit([payload]);
            this.setMessage({dataType, text: `Request successfully submitted!`, type: 'success'});
        } catch (error) {
            console.error('ERROR:CommitController:submitPayload', error);
            if (dataType) {
                this.service.handlePayloadRevert(payload);
                this.setMessage({dataType, text: `Request failed!`, type: 'danger'});
            }
        }
    }
}
