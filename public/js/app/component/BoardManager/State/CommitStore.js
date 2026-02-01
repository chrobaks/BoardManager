export default class CommitStore {
    constructor() {
        this.queue = [];
    }

    add(entry) {
        this.queue.push(entry);
    }

    all() {
        return this.queue;
    }

    length() {
        return this.queue.length;
    }

    clear() {
        this.queue = [];
    }

    hasChanges() {
        return this.queue.length > 0;
    }

    deleteByIndex(undoIndexList) {
        try {
            if (!undoIndexList?.length) {
                return;
            }
            const newQueue = [];

            this.queue.forEach((entry, index) => {
                if (!undoIndexList.includes(index)) {
                    newQueue.push(entry);
                }
            });
            this.queue = newQueue;
        } catch (e) {
            console.error('ERROR:CommitStore:deleteByIndex', e);
        }
    }
}
