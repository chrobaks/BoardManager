
export default class CommitService {
    /**
     *
     * @param {CommitStore} store
     * @param {CommitView}  view
     * @param {DomEventManager} domEventManager
     * @param dataType
     */
    constructor(store, view, domEventManager, dataType) {
        this.store = store;
        this.view = view;
        this.domEventManager = domEventManager;
        this.dataType = dataType;
    }

    handlePayloadRevert(payload) {
        try {
            if (payload && payload.type) {
                this.domEventManager.eventBus.emit(
                    this.domEventManager.eventIdentifierFromCustomer(this.dataType, payload),
                    {cache: payload.cache, payload: payload.payload}
                );
                this.domEventManager.eventBus.emit(
                    this.domEventManager.eventIdentifierFromCustomer(this.dataType, {
                        type: payload.type,
                        action: 'reset'
                    }),
                    {}
                );
            }
        } catch (error) {
            console.error('ERROR:CommitService:handlePayloadRevert', error);
        }
    }

    handleCommitRevert(index) {
        try {
            const commit = this.store.getRevertByIndex(index);
            if (commit && commit.type) {
                this.domEventManager.eventBus.emit(
                    this.domEventManager.eventIdentifierFromCustomer(this.dataType, commit),
                    {index: index, cache: commit.cache, payload: commit.payload}
                );
            }
        } catch (error) {
            console.error('ERROR:CommitService:handleCommitRevert', error);
        }
    }

    handleRevertFinished() {
        this.updateCommits();
        this.domEventManager.eventBus.emit('category:reset', {});
        this.domEventManager.eventBus.emit('item:reset', {});
    }

    displayCommitList() {
        const commitList = this.store.all();
        const show = this.view.listBoard.classList.contains('d-none');

        this.view.showAlertBoard(false);

        if (commitList.length && this.view.listBoard.classList.contains('d-none')) {
            this.view.renderCommitList(commitList);
        }

        this.view.changeDeleteAllSwitchCheck(false);
        this.view.showListBoard(show);
    }

    updateCommits () {
        try {
            const undoIndexList = this.view.getUndoCommitList();

            if (undoIndexList.length === 0) return;

            this.store.deleteByIndex(undoIndexList);
            this.view.removeCommitListItem(undoIndexList);

            if (this.store.length() === 0) {
                this.view.showListBoard(false);
                this.view.showCommitCtrl(this.store.hasCommits());
            } else {
                this.view.renderCommitList(this.store.all());
            }
        } catch (error) {
            console.error('ERROR:CommitService:updateCommits', error);
        }
    }

    updateListBoard(commit) {
        try {
            if (!this.store.add(commit)) {
                throw new Error(`ERROR:CommitService:updateListBoard add commit to store.`);
            }

            this.view.showCommitCtrl(this.store.hasCommits());
            this.view.renderCommitList(this.store.all());
            this.view.showListBoard(true);
            this.view.changeDeleteAllSwitchCheck(false);
        } catch (error) {
            console.error('ERROR:CommitService:updateListBoard', error);
            return false;
        }

        return this.store.hasCommits();
    }

    updateCommitBoard() {
        try {
            this.view.showAlertBoard(false);
            this.view.showListBoard(false);
            this.store.clear();
            this.view.showCommitCtrl(this.store.hasCommits());
        } catch (error) {
            console.error('ERROR:CommitService:updateCommitBoard', error);
        }
    }

    async execSubmit(data) {
        const url = this.view.getWrapperDataValue('fetchUrl');
        if (!url) {
            throw new Error(`Error: fetchUrl is not set. Please set it in the board settings.`);
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`ServerError: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!result?.status ||  result.status && result.status !== 'success') {
            throw new Error(result.message || 'ERROR:CommitService:execSubmit key status not found in response or is not success');
        }

        return result;
    }
}