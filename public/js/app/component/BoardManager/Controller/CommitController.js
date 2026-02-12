
import CommitFactory from '../Factory/CommitFactory.js';
import CommitService from '../Service/CommitService.js';

export default class CommitController {
    /**
     * @param {CommitStore} store
     * @param commitView
     * @param {CommitState} commitState
     * @param {HTMLElement} container
     * @param {EventBus} eventBus
     */
    constructor(store, commitView, commitState, container, eventBus) {
        this.store = store;
        this.view = commitView;
        this.commitState = commitState;
        this.container = container;
        this.events = eventBus;
        this.dataType = 'commit';
        this.factory = new CommitFactory({
            'delete': 'revert:delete',
            'deleteItemFromAll': 'revert:item',
            'deleteItemFromCategory': 'revert:item',
            'update': 'revert:update',
            'add': 'revert:add',
        });
        this.service = new CommitService(this.store, this.view);
    }

    init() {
        this.view.init();
        this.commitState.setAutoEnabled(this.view.autoCommitSwitchIsChecked());
        this.view.showCommitCtrl(false);

        this.events.on('click:commit:submit', () => this.submitCommits());
        this.events.on('click:commit:show:list', () => this.showListCommits());
        this.events.on('click:commit:undo:exec', () => this.execCommitUndo());
        this.events.on('change:commit:autoCommitSwitch', (payload) => this.changeAutoCommitSwitch(payload));
        this.events.on('change:commit:undo', () => this.commitUndo());
        this.events.on('change:commit:undo:all', (payload) => this.commitUndoAll(payload));
        this.events.on('commit:add', (payload) => this.handleAddCommit(payload));
        this.events.on('commit:remove', () => this.removeCommit());
        this.events.on('commit:reverted', (payload) => this.revertedCommit(payload));
        this.events.on('commit:message:show', (payload) => this.showMessage(payload));

        this.events.emit('commit:message:show', { text: 'Commit controls loaded', type: 'info' });
    }

    removeCommit() {
        const undoIndexList = this.view.getUndoCommitList();

        if (undoIndexList.length === 0) return;

        if (this.store.setRevertList(undoIndexList)) {
           this.revertedCommit(0);
        }
    }

    revertedCommit(index) {
        if (index < this.store.revertList.length) {
            const commit = this.store.getRevertByIndex(index);
            if (commit && commit.type) {
                this.events.emit(
                    this.factory.getEventAction(commit),
                    {index: index, cache: commit.cache, payload: commit.payload}
                );
            }
        } else {
            this.service.updateCommits();
            this.events.emit('category:reset', {});
            this.events.emit('item:reset', {});
            this.events.emit(this.dataType + ':message:show', {
                text: `Reverted all selected changes.`,
                type: 'success'
            });
        }
    }

    execCommitUndo () {
        this.events.emit('modal:prompt:delete', {
            type: this.dataType,
            payload: {},
            msg:'Warning!!! All marked commits will be reverted. This will also change the current data! Do you want to continue?'
        });
    }
    commitUndo () {
        this.view.renderActiveCommitItem();
    }
    commitUndoAll (payload) {
        this.view.changeUndoCommitSwitch(payload.targetElement.checked);
        this.view.renderActiveCommitItem();
    }

    showMessage(payload) {
        this.view.showMessage(payload);
    }

    showListCommits () {
        const commitList = this.store.all();
        const show = this.view.listBoard.classList.contains('d-none');

        this.view.showAlertBoard(false);
        if (commitList.length && this.view.listBoard.classList.contains('d-none')) {
            this.view.renderCommitList(commitList);
        }
        this.view.changeDeleteAllSwitchCheck(false);
        this.view.showListBoard(show);
    }

    changeAutoCommitSwitch(payload) {
        this.view.showAlertBoard(false);
        if (!this.commitState.autoIsEnabled() && this.store.length() > 0) {
            payload.targetElement.checked = false;
            this.view.showAlertBoard(true);
            globalThis.setTimeout(() => this.view.showAlertBoard(false), 5000);
        } else {
            this.commitState.toggleAutoEnabled();
            this.view.showCommitCtrl(this.store.hasChanges());
        }
    }

    handleAddCommit(commit) {
        console.log('handleAddCommit:', commit);
        this.view.showAlertBoard(false);
        if (!this.view.autoCommitSwitchIsChecked()) {
            if (this.service.updateListBoard(commit)) {
                this.events.emit(this.dataType + ':message:show', {
                    text: `New ${commit.action} commit successfully created`,
                    type: 'success'
                });
            }
        } else {
            this.view.showListBoard(false);
            this.submitSingleCommit(commit);
        }
    }

    async submitCommits() {
        const commits = this.store.all();
        console.log('submitCommits:', commits);
        this.view.showAlertBoard(false);
        this.view.showListBoard(false);

        if (commits.length === 0) return;
        try {
            // await fetch('/api/commit', { method: 'POST', body: JSON.stringify(commits) });
            
            this.store.clear();
            this.view.showCommitCtrl(this.store.hasChanges());
            this.events.emit('message:show', { text: 'Commit successfully submitted', type: 'success' });
        } catch (error) {
            console.error('Failed to submit commits', error);
            // this.events.emit('message:show', { text: 'Error saving commits', type: 'danger' });
        }
    }

    async submitSingleCommit(payload) {
        try {
            // await fetch('/api/commit', { method: 'POST', body: JSON.stringify([payload]) });

            this.events.emit('message:show', {
                text: 'Changes saved automatically',
                type: 'success'
            });
        } catch (error) {
            console.error('Auto-commit failed', error);
            // this.events.emit('message:show', {
            //     text: 'Automatic saving failed',
            //     type: 'danger'
            // });
        }
    }
}
