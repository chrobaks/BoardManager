export default class CommitController {
    /**
     * @param {CommitStore} store
     * @param commitView
     * @param {CommitState} commitState
     * @param {HTMLElement} container
     * @param {EventBus} eventBus
     */
    constructor(store, commitView, commitState, container, eventBus) {
        this.events = eventBus;
        this.commitState = commitState;
        this.view = commitView;
        this.store = store;
        this.container = container;
    }

    init() {
        this.view.init();
        this.commitState.setAutoEnabled(this.view.autoCommitSwitchIsChecked());
        this.view.showCommitCtrl(false);

        this.events.on('commit:add', (payload) => this.handleAddCommit(payload));
        this.events.on('click:commit:submit', () => this.submitCommits());
        this.events.on('click:commit:show:list', () => this.showListCommits());
        this.events.on('click:commit:undo:exec', () => this.execCommitUndo());
        this.events.on('change:commit:autoCommitSwitch', (payload) => this.changeAutoCommitSwitch(payload));
        this.events.on('change:commit:undo', () => this.commitUndo());
        this.events.on('change:commit:undo:all', (payload) => this.commitUndoAll(payload));
    }

    execCommitUndo () {
        const undoIndexList = this.view.getUndoCommitList();

        if (undoIndexList.length === 0) return;

        this.store.deleteByIndex(undoIndexList);
        this.view.removeCommitListItem(undoIndexList);

        if (this.store.length() === 0) {
            this.view.showListBoard(false);
            this.view.showCommitCtrl(this.store.hasChanges());
        } else {
            this.view.renderCommitList(this.store.all());
        }
    }
    commitUndo () {
        this.view.renderActiveCommitItem();
    }
    commitUndoAll (payload) {
        this.view.changeUndoCommitSwitch(payload.targetElement.checked);
        this.view.renderActiveCommitItem();
    }

    showListCommits () {
        const commitList = this.store.all();
        const board = this.container.querySelector('.commit-list-board');
        const show = board.classList.contains('d-none');

        this.view.showAlertBoard(false);
        if (commitList.length && board.classList.contains('d-none')) {
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

    handleAddCommit(payload) {
        console.log('handleAddCommit:', payload, this.view.autoCommitSwitchIsChecked());
        this.view.showAlertBoard(false);
        this.view.showListBoard(false);
        if (!this.view.autoCommitSwitchIsChecked()) {
            this.store.add(payload);
            this.view.showCommitCtrl(this.store.hasChanges());
            this.events.emit('message:show', { text: 'New commit successfully created', type: 'success' });
        } else {
            this.submitSingleCommit(payload);
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
            this.events.emit('message:show', { text: 'Error saving commits', type: 'danger' });
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
            this.events.emit('message:show', {
                text: 'Automatic saving failed',
                type: 'danger'
            });
        }
    }
}
