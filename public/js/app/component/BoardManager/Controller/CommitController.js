export default class CommitController {
    /**
     * @param {CommitStore} store
     * @param {CommitState} commitState
     * @param {HTMLElement} container
     * @param {EventBus} eventBus
     */
    constructor(store, commitState, container, eventBus) {
        this.events = eventBus;
        this.commitState = commitState;
        this.store = store;
        this.container = container;
    }

    init() {
        this.commitCtrl = this.container.querySelector('.commit-ctrl');
        this.autoCommitAlert = this.container.querySelector('.commit-alert');
        this.autoCommitSwitch = this.container.querySelector('#switchSaveCommit');
        this.commitState.setAutoEnabled(this.autoCommitSwitch.checked);

        this.events.on('commit:add', (payload) => this.handleAddCommit(payload));
        this.events.on('click:commit:submit', () => this.submitCommits());
        this.events.on('change:commit:autoCommitSwitch', (payload) => this.changeAutoCommitSwitch(payload));

        // Initial state check
        this.updateVisibility();
    }

    changeAutoCommitSwitch(payload) {
        this.handleErrorAlertState(false);
        if (!this.commitState.autoIsEnabled() && this.store.length() > 0) {
            //this.submitSingleCommit(this.store.all()[0]);
            payload.targetElement.checked = false;
            this.handleErrorAlertState(true);
        } else {
            this.commitState.toggleAutoEnabled();
            this.updateVisibility()
        }
    }

    isAutoCommitEnabled() {
        return this.autoCommitSwitch ? this.autoCommitSwitch.checked : true;
    }

    handleAddCommit(payload) {
        console.log('handleAddCommit:', payload);
        this.handleErrorAlertState(false);
        if (!this.isAutoCommitEnabled()) {
            this.store.add(payload);
            this.updateVisibility();
            this.events.emit('message:show', { text: 'New commit successfully created', type: 'success' });
        } else {
            this.submitSingleCommit(payload);
        }
    }

    updateVisibility() {
        if (this.commitCtrl) {
            if (this.store.hasChanges()) {
                this.commitCtrl.classList.remove('d-none');
            } else {
                this.commitCtrl.classList.add('d-none');
            }
        }
    }

    handleErrorAlertState(show) {
        if (!show) {
            this.autoCommitAlert.classList.add('d-none');
        } else if (show && this.autoCommitAlert.classList.contains('d-none')) {
            this.autoCommitAlert.classList.remove('d-none');
        }
        this.commitState.setShowErrorAlert(show);
    }

    async submitCommits() {
        const commits = this.store.all();
        console.log('submitCommits:', commits);
        this.handleErrorAlertState(false);
        if (commits.length === 0) return;
        try {
            // await fetch('/api/commit', { method: 'POST', body: JSON.stringify(commits) });
            
            this.store.clear();
            this.updateVisibility();
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
