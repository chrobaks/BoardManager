import Utils from '../../../core/Utils.js';

export default class CommitStore {
    constructor() {
        this.queue = [];
        this.revertList = [];
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

    setRevertList(undoIndexList) {
        this.revertList = [];
        try {
            if (!undoIndexList?.length) {
                return [];
            }
            const newQueue = [];

            this.queue.forEach((entry, index) => {
                if (undoIndexList.includes(index) && Utils.collectionLength(entry.cache)) {
                    newQueue.push(entry);
                }
            });
            this.revertList = [...newQueue].reverse();
        } catch (e) {
            console.error('ERROR:CommitStore:deleteByIndex', e);
        }
        return this.revertList.length;
    }

    getRevertByIndex(index) {
        return this.revertList?.[index] ?? null;
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
