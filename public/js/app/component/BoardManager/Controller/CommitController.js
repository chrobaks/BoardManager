export default class CommitController {
    /**
     * @param {CommitStore} store
     * @param {HTMLElement} container
     * @param {EventBus} eventBus
     */
    constructor(store, container, eventBus) {
        this.store = store;
        this.container = container;
        this.events = eventBus;
        this.commitCtrl = this.container.querySelector('.commit-ctrl');
        this.autoCommitSwitch = this.container.querySelector('#switchSaveCommit');
    }

    init() {
        this.events.on('commit:add', (payload) => this.handleAddCommit(payload));
        this.events.on('click:commit:submit', () => this.submitCommits());
        
        if (this.autoCommitSwitch) {
            this.autoCommitSwitch.addEventListener('change', () => this.updateVisibility());
        }

        // Initial state check
        this.updateVisibility();
    }

    isAutoCommitEnabled() {
        return this.autoCommitSwitch ? this.autoCommitSwitch.checked : true;
    }

    handleAddCommit(payload) {
        if (!this.isAutoCommitEnabled()) {
            this.store.add(payload);
            this.updateVisibility();
            this.events.emit('message:show', { text: 'Neuer Commit erfolgreich angelegt', type: 'success' });
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

    async submitCommits() {
        const commits = this.store.all();
        if (commits.length === 0) return;

        try {
            // await fetch('/api/commit', { method: 'POST', body: JSON.stringify(commits) });
            
            this.store.clear();
            this.updateVisibility();
            this.events.emit('message:show', { text: 'Commits erfolgreich gespeichert', type: 'success' });
        } catch (error) {
            console.error('Failed to submit commits', error);
            this.events.emit('message:show', { text: 'Fehler beim Speichern der Commits', type: 'danger' });
        }
    }

    async submitSingleCommit(payload) {
        try {
            // await fetch('/api/commit', { method: 'POST', body: JSON.stringify([payload]) });

            this.events.emit('message:show', {
                text: 'Änderung automatisch gespeichert',
                type: 'success'
            });
        } catch (error) {
            console.error('Auto-Commit fehlgeschlagen', error);
            this.events.emit('message:show', {
                text: 'Automatisches Speichern fehlgeschlagen',
                type: 'danger'
            });
        }
    }
}
