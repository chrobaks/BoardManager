
export default class CommitService {
    constructor(store, view) {
        this.store = store;
        this.view = view;
    }

    updateCommits () {
        try {
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
        } catch (error) {
            console.error('ERROR:CommitService:updateCommits', error);
        }
    }

    updateListBoard(commit) {
        try {
            this.store.add(commit);
            this.view.showCommitCtrl(this.store.hasChanges());
            this.view.renderCommitList(this.store.all());
            this.view.showListBoard(true);
        } catch (error) {
            console.error('ERROR:CommitService:updateListBoard', error);
            return false;
        }

        return this.store.hasChanges();
    }
}